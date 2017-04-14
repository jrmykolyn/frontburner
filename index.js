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
function getInlineNotes( input ) {
	input = input || null;

	if ( !input ) { printArgError( 'input' ); return; }

	var output = {};

	// Check `input` for text matching each of the `keywords`.
	config.keywords.forEach( ( keyword ) => {
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

/* -------------------------------------------------- */
/* INIT */
/* -------------------------------------------------- */
if ( !ARGS || !ARGS.length ) {
	/// TODO[@jrmykolyn] - Display warning/error/menu.
} else {
	fileName = ARGS[ 0 ];

	switch ( fileName ) {
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
					var noteObj = getInlineNotes( decoder.write( data ), 'FIXME' );
					var outputText = formatNoteObj( noteObj );

					fs.writeFile( process.cwd() + '/' + getLogName( logFile ), outputText, ( err, data ) => {
						if ( err ) {
							console.error( 'Whoops! Something went wrong!' );
							return;
						}

						console.log( 'Success!' ); /// TODO[@jrmykolyn] - Update 'success' message to include useful info.
					} );
				} else {
					/// TODO[@jrmykolyn] - Handle case where data *IS NOT* a Buffer instance.
				}
			} );
	}
}
