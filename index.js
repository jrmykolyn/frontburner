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

// Vendor
const recursive = require( 'recursive-readdir' );
const Promise = require( 'bluebird' );

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
const inputParser = new InputParser( ARGS );
const fileParser = new FileParser();
const outputParser = new OutputParser();
const logger = new Logger();

/* -------------------------------------------------- */
/* DECLARE FUNCTIONS */
/* -------------------------------------------------- */
function init( ARGS ) {
	let fileName = null;
	let filePath = null;
	let filePaths = [];
	let multiFile = false;

	return new Promise( function( resolve, reject ) {
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
					multiFile = true;
				default:
					if ( multiFile ) {
						/// TODO[@jrmykolyn]: Move 'excludes' into config.
						recursive( process.cwd(), [ 'node_modules', '.git', 'frontburner*' ], function( err, files ) {
							filePaths = files.map( function ( filePath ) {
								return [ filePath, fs.readFileSync( filePath, 'utf8' ) ]
							} );

							resolve( filePaths );
						} );
					} else {
						// Prepend current dir. if `fileName` is not an absolute path.
						filePath = ( fileName.substring( 0, 1 ) === '/' ) ? fileName : `${process.cwd()}/${fileName}`;

						filePaths.push( [ filePath, fs.readFileSync( filePath, 'utf8' ) ] );

						resolve( filePaths );
					}
				}
		}
	} );
}

function parse( filePaths ) {
	let settings = inputParser.getSettings();

	return new Promise( function( resolve, reject ) {
		filePaths.forEach( function( tuple ) {
			let [ filePath, data ] = tuple;

			fileParser.addFile( {
				meta: {
					path: filePath,
				},
				data: data,
			} );
		} );

		resolve( fileParser.parse( settings ) );
	} );
}

function log( output ) {
	if ( inputParser.getOption( '--display' ) ) {
		console.log( output );
	} else {
		outputParser.writeLog( output );
	}
}

/* -------------------------------------------------- */
/* INIT */
/* -------------------------------------------------- */
/// TODO[@jrmykolyn]: `ARGS` should be extracted from `InputParser` instance.
init( ARGS )
	.then( parse )
	.then( log )
	.catch( function( err ) {
		console.log( err );
	} );
