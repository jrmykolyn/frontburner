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
const OutputParser = require( './lib/output-parser' );
const Logger = require( './lib/logger' );

/* -------------------------------------------------- */
/* DECLARE VARS */
/* -------------------------------------------------- */
const ARGS = process.argv.slice( 2 ) || [];

const decoder = new StringDecoder( 'utf8' );
const inputParser = new InputParser( ARGS ); /// TEMP
const fileParser = new FileParser();
const outputParser = new OutputParser();
const logger = new Logger();

var fileName = null;
var filePath = null;

/* -------------------------------------------------- */
/* INIT */
/* -------------------------------------------------- */
if ( !ARGS || !ARGS.length ) {
	/// TODO[@jrmykolyn] - Display warning/error/menu.
} else {
	fileName = ARGS[ 0 ];

	switch ( fileName ) {
	case 'help':
		console.log( logger.help() );

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

				outputText = fileParser.parse( inputParser.getSettings() );

				if ( displayOnly ) {
					console.log( outputText );
				} else {
					outputParser.writeLog( outputText );
				}
			} else {
				/// TODO[@jrmykolyn] - Handle case where data *IS NOT* a Buffer instance.
			}
		} );
	}
}
