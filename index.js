#! /usr/bin/env node

/* -------------------------------------------------- */
/* IMPORT MODULES */
/* -------------------------------------------------- */
// Node
const fs = require( 'fs' );
const StringDecoder = require( 'string_decoder' ).StringDecoder;

// Project
const config = require( `${__dirname}/config/frontburner.config.js` ) || {};

/* -------------------------------------------------- */
/* DECLARE VARS */
/* -------------------------------------------------- */
const decoder = new StringDecoder( 'utf8' );

const ARGS = process.argv.slice( 2 ) || [];
const OPTIONS = ARGS.filter( ( arg ) => { return arg.substring( 0, 2 ) === '--'; } );

var fileName = null;
var filePath = null;

var logFile = {
	base: 'frontburner',
	extension: '.log'
};

/* -------------------------------------------------- */
/* DECLARE FUNCTIONS */
/* -------------------------------------------------- */
/**
 * Given an `input` string, function returns an object containing all occurrences of the specified `keywords`.
 *
 * @param {String} `input` - The text content to check.
 * @return {Object}
 */
function getInlineNotes( input, keywords ) {
	input = input || null;
	keywords = ( Array.isArray( keywords ) && keywords.length ) ? keywords : [];

	if ( !input ) { printArgError( 'input' ); return; }

	var output = {};

	// Check `input` for text matching each of the `keywords`.
	keywords.forEach( ( keyword ) => {
		let pattern = new RegExp( keyword + '(.*)$', 'gmi' );

		output[ keyword ] = input.match( pattern );
	} );

	return output;
}

/**
 * Given a `noteObj`, function generates a human-readable version of the included data.
 *
 * @param {Object} `noteObj` - An object of 'inline note' data.
 * @return {String}
 */
function formatNoteObj( noteObj ) {
	noteObj = ( noteObj && typeof noteObj === 'object' ) ? noteObj : null;

	var output = '';

	if ( !noteObj ) { printArgError( 'noteObj' ); }

	for ( let key in noteObj ) {
		if ( noteObj[ key ] && Array.isArray( noteObj[ key ] ) ) {
			output += `${key}\n`;
			output += '--------------------------------------------------';
			output += '\n';
			output += noteObj[ key ].reduce( ( a1, a2 ) => { return `${a1}\n${a2}\n`; } );
			output += '\n\n';
		}
	}

	return output;
}

/**
 * Given an array of argument names, function prints out an approrpriate error message.
 *
 * @param {Array} `args` - A list of argument names to be printed out.
 */
function printArgError( args ) {
	// Ensure that `args` is an array.
	args = ( Array.isArray( args ) ) ? args : ( typeof args === 'string' ) ? [ args ] : [];

	// Print conditional error message based on length of `args` array.
	if ( args && args.length ) {
		console.log( `Whoops! Function called with missing or invalid argument(s):` );
		args.forEach( ( arg ) => { console.log( `- ${arg}` ); } );
	} else {
		console.log( 'Whoops! Something went wrong!' );
	}
}

function printHelp() {
	console.log( '--------------------------------------------------' );
	console.log( 'INTRO' );
	console.log( '---------------' );
	console.log( 'Frontburner is designed to be run from the command line using the `fbr` command.' );
	console.log( 'Start with the command, followed by the name of the file that you want to \'scan\'.' );
	console.log( '\n' );
	console.log( 'EXAMPLE:' );
	console.log( '---------------' );
	console.log( 'fbr path/to/my/file' );
	console.log( '\n' );
	console.log( 'OPTIONS:' );
	console.log( '---------------' );
	console.log( '--display' );
	console.log( 'Including this option will log the contents of the \'scan\' to stdout, and suppress the creation of a log file.' );
	console.log( '\r' );
	console.log( 'Usage:' );
	console.log( 'fbr path/to/my/file --display' );
	console.log( '\n' );
	console.log( '--keywords' );
	console.log( 'This option overrides the default \'keywords\' that Frontburner checks for. User selected keywords must be provided as a series of comma separated strings.' );
	console.log( '\r' );
	console.log( 'Usage:' );
	console.log( 'fbr path/to/my/file --keywords=FIXME,TODO' );
	console.log( '--------------------------------------------------' );
	console.log( '\n' );
}

/**
 * Given a `logFile` object, function assembles and returns a timestamped 'output' file name.
 *
 * @param {Object} `logFile` - An object which includes various pieces of the 'output' file name, such as: `base`; `extension`, etc.
 * @return {String}
 */
function getLogName( logFile ) {
	logFile = ( logFile && typeof logFile === 'object' ) ? logFile : {};

	var base = logFile.base || 'frontburner';
	var extension = logFile.extension || '.log';
	var timestamp = new Date().getTime();

	return ( `${base}_${timestamp}${extension}` );
}

/**
 * Given an array of 'option' strings, function extracts and returns a 'keywords' array.
 *
 * If the arguments are invalid or the desired 'option' is not found, function returns `null`.
 *
 * @param {Array} `options`
 * @return {Null|Array}
 */
function getKeywordsFromOptions( options ) {
	// Validate/re-assign args.
	options = ( Array.isArray( options ) && options.length ) ? options : null;

	// Log errors if args are missing/invalid.
	if ( !options ) { printArgError( 'options' ); return null; }

	var keywordsString = extractOption( '--keywords', options );
	var keywordsArr = null;

	try {
		keywordsArr = keywordsString.split( '=' )[ 1 ].split( ',' );

		return ( Array.isArray( keywordsArr ) && keywordsArr.length ) ? keywordsArr : null;
	} catch ( err ) {
		return null;
	}
}

/**
 * Given a specific option, function returns it (including the key, value, and delimiter) if present within the `options` array.
 *
 * @param {String} `option`
 * @param {Array} `options`
 * @return {Null|String}
 */
function extractOption( option, options ) {
	// Validate/re-assign args.
	option = ( option && typeof option === 'string' ) ? option : null;
	options = ( Array.isArray( options ) && options.length ) ? options : null;

	// Log errors if args are missing/invalid.
	if ( !option ) { printArgError( 'option' ); return null; }
	if ( !options ) { printArgError( 'options' ); return null; }

	// Return first matched option or `null`.
	return options.filter( ( opt ) => { return opt.includes( option ); } )[ 0 ] || null;
}

/* -------------------------------------------------- */
/* INIT */
/* -------------------------------------------------- */
if ( !ARGS || !ARGS.length ) {
	/// TODO[@jrmykolyn] - Display warning/error/menu.
} else {
	fileName = ARGS[ 0 ];

	switch ( fileName ) {
		case 'help':
			printHelp();

			break;
		case '*':
		case '.':
			/// TODO[@jrmykolyn] - Handle recursive 'scan' of subfolders.'
			console.error( 'Whoops! The following option isn\'t currently supported: ', fileName );

			break;
		default:
			filePath = process.cwd() + '/' + fileName;

			fs.readFile( filePath, ( err, data ) => {
				if ( err ) {
					console.log( 'Whoops! Something went wrong!' );
					return;
				}

				if ( data instanceof Buffer ) {
					var keywords = getKeywordsFromOptions( OPTIONS ) || config.keywords
					var noteObj = getInlineNotes( decoder.write( data ), keywords );
					var outputText = formatNoteObj( noteObj );
					var displayOnly = !!extractOption( '--display', OPTIONS );

					if ( displayOnly ) {
						console.log( outputText );
					} else {
						fs.writeFile( process.cwd() + '/' + getLogName( logFile ), outputText, ( err, data ) => {
							if ( err ) {
								console.error( 'Whoops! Something went wrong!' );
								return;
							}

							console.log( 'Success!' ); /// TODO[@jrmykolyn] - Update 'success' message to include useful info.
						} );
					}
				} else {
					/// TODO[@jrmykolyn] - Handle case where data *IS NOT* a Buffer instance.
				}
			} );
	}
}
