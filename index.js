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
const recursive = require( 'recursive-readdir' );
const Promise = require( 'bluebird' );

// Project
const InputParser = require( './lib/input-parser' );
const FileParser = require( './lib/file-parser' );
const OutputParser = require( './lib/output-parser' );

/* -------------------------------------------------- */
/* DECLARE VARS */
/* -------------------------------------------------- */
let inputParser;
let fileParser;
let outputParser;

/* -------------------------------------------------- */
/* DECLARE FUNCTIONS */
/* -------------------------------------------------- */
function frontburner( args, opts ) {
	// Ensure `args` data type is correct.
	args = ( Array.isArray( args ) ) ? args : [ args ];

	// Update global vars.
	inputParser = new InputParser( args, opts );
	fileParser = new FileParser();
	outputParser = new OutputParser();

	return new Promise( ( resolve, reject ) => {
		init( args[ 0 ] )
			.then( parse )
			.then( log )
			.then( resolve, reject );
	} );
}

function init( target ) {
	let filePaths = [];

	return new Promise( function( resolve ) {
		if ( !target ) {
			throw new Error( 'Whoops! Frontburner requires at least one argument.' );
		}

		// Prepend current working directory if input is not an absolute path.
		target = ( target.substring( 0, 1 ) !== '/' ) ? `${process.cwd()}/${target}` : target;

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
	return new Promise( function( resolve ) {
		if ( inputParser.getOption( 'display' ) ) {
			console.log( output );
		} else {
			outputParser.writeLog( output );
		}

		resolve( output );
	} );
}

/* -------------------------------------------------- */
/* PUBLIC API */
/* -------------------------------------------------- */
module.exports = frontburner;
