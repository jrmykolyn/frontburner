#! /usr/bin/env node

/* -------------------------------------------------- */
// DECLARE `ESLint` GLOBALS
/* -------------------------------------------------- */
// 'global' declarations below required to prevent ESLint errors.
/* global
	process
	console
*/

/* -------------------------------------------------- */
/* IMPORT MODULES */
/* -------------------------------------------------- */
// Node
const fs = require( 'fs' );

// Vendor
const meow = require( 'meow' );
const recursive = require( 'recursive-readdir' );
const Promise = require( 'bluebird' );

// Project
const config = require( './config/frontburner.config.js' );

const InputParser = require( './lib/input-parser' );
const FileParser = require( './lib/file-parser' );
const OutputParser = require( './lib/output-parser' );

/* -------------------------------------------------- */
/* DECLARE VARS */
/* -------------------------------------------------- */
const cli = meow( {
	help: `
NAME
	Frontburner

SYNOPSIS
	fbr [--display] [path/to/file]

EXAMPLES
	fbr index.js
	fbr .
	fbr lib/index.js --display

DESCRIPTION
	Frontburner is designed to be run from the command line using the \`fbr\` command.

	Start with the command, followed by the name of the file that you want to 'scan'.

OPTIONS
	--display
	Including this option will log the contents of the 'scan' to stdout, and suppress the creation of a log file.

	--keywords
	This option overrides the default 'keywords' that Frontburner checks for. User selected keywords must be provided as a series of comma separated strings.
	`,
} );

const inputParser = new InputParser( cli.input, cli.flags );
const fileParser = new FileParser();
const outputParser = new OutputParser();

/* -------------------------------------------------- */
/* DECLARE FUNCTIONS */
/* -------------------------------------------------- */
function init() {
	let fileName = null;
	let filePath = null;
	let filePaths = [];

	return new Promise( function( resolve ) {
		fileName = cli.input[ 0 ];

		if ( !fileName ) {
			throw new Error( 'Whoops! Frontburner requires at least one argument.' );
		}

		if ( fileName === '.' ) {
			recursive( process.cwd(), config.excludes, function( err, files ) {
				filePaths = files.map( function( filePath ) {
					return [ filePath, fs.readFileSync( filePath, 'utf8' ) ];
				} );

				resolve( filePaths );
				return;
			} );
		} else {
			// Prepend current dir. if `fileName` is not an absolute path.
			filePath = ( fileName.substring( 0, 1 ) === '/' ) ? fileName : `${process.cwd()}/${fileName}`;

			filePaths.push( [ filePath, fs.readFileSync( filePath, 'utf8' ) ] );

			resolve( filePaths );
			return;
		}
	} );
}

function parse( filePaths ) {
	let settings = inputParser.getSettings();

	return new Promise( function( resolve ) {
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
	if ( inputParser.getOption( 'display' ) ) {
		console.log( output );
	} else {
		outputParser.writeLog( output );
	}
}

/* -------------------------------------------------- */
/* INIT */
/* -------------------------------------------------- */
init()
	.then( parse )
	.then( log )
	.catch( ( err ) => {
		console.log( err.message || err );
	} );
