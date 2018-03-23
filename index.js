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
	fbr [--display --excludes=<temp,logs> --prefixes=<baz,quux> --keywords=<foo,bar>] [path/to/file]

EXAMPLES
	fbr index.js
	fbr .
	fbr lib/index.js --display
	fbr . --keywords=TODO,FIXME
	fbr . --prefixes=@
	fbr . --excludes=logs

DESCRIPTION
	Frontburner is designed to be run from the command line using the \`fbr\` command.

	Start with the command, followed by the name of the file that you want to 'scan'. For example: \`fbr index.js\`.

	To recursively scan a folder, provide the path. For example: \`fbr path/to/folder/\`.

OPTIONS
	--display
	Suppress log file creation, print output to stdout.

	--excludes=<temp,logs>
	Override the files/folders which Frontburner excludes by default.

	--prefixes=<baz,quux>
	Override the default 'keyword prefixes' that Frontburner checks for.

	--keywords=<foo,bar>
	Override the default 'keywords' that Frontburner checks for.
	`,
} );

const inputParser = new InputParser( cli.input, cli.flags );
const fileParser = new FileParser();
const outputParser = new OutputParser();

/* -------------------------------------------------- */
/* DECLARE FUNCTIONS */
/* -------------------------------------------------- */
function init() {
	let target = null;
	let filePaths = [];

	return new Promise( function( resolve ) {
		if ( !cli.input[ 0 ] ) {
			throw new Error( 'Whoops! Frontburner requires at least one argument.' );
		}

		// Prepend current working directory if input is not an absolute path.
		target = ( cli.input[ 0 ].substring( 0, 1 ) !== '/' ) ? `${process.cwd()}/${cli.input[ 0 ]}` : cli.input[ 0 ];

		// Handle cases where `target` is a folder.
		if ( fs.lstatSync( target ).isDirectory() ) {
			recursive( target, inputParser.getSettings().excludes, function( err, files ) {
				filePaths = files.map( function( path ) {
					return [ path, fs.readFileSync( path, 'utf8' ) ];
				} );

				resolve( filePaths );
				return;
			} );
		// Handle cases where `target` is a file.
		} else {
			filePaths.push( [ target, fs.readFileSync( target, 'utf8' ) ] );

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
