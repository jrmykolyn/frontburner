#! /usr/bin/env node

/* -------------------------------------------------- */
// DECLARE `ESLint` GLOBALS
/* -------------------------------------------------- */
// 'global' declarations below required to prevent ESLint errors.
/* global
	process
	Buffer
	console
*/

/* -------------------------------------------------- */
/* IMPORT MODULES */
/* -------------------------------------------------- */
// Node
const fs = require( 'fs' );
const StringDecoder = require( 'string_decoder' ).StringDecoder;

// Project
const InputParser = require( './lib/input-parser' );
const FileParser = require( './lib/file-parser' );

/* -------------------------------------------------- */
/* DECLARE VARS */
/* -------------------------------------------------- */
const ARGS = process.argv.slice( 2 ) || [];

const decoder = new StringDecoder( 'utf8' );
const inputParser = new InputParser( ARGS ); /// TEMP
const fileParser = new FileParser();

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
 * ...
 */
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
				var outputText = '';
				var displayOnly = !!inputParser.getOption( '--display' );

				fileParser.addFile( {
					meta: {
						path: filePath,
					},
					data: decoder.write( data )
				} );

				outputText = fileParser.parse();

				if ( displayOnly ) {
					console.log( outputText );
				} else {
					fs.writeFile( process.cwd() + '/' + getLogName( logFile ), outputText, ( err ) => {
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
