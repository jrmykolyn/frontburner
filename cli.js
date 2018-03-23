#! /usr/bin/env node

/* -------------------------------------------------- */
// DECLARE `ESLint` GLOBALS
/* -------------------------------------------------- */
// 'global' declarations below required to prevent ESLint errors.
/* global
	console
*/

/* -------------------------------------------------- */
/* IMPORT MODULES */
/* -------------------------------------------------- */
// Node

// Vendor
const chalk = require( 'chalk' );
const meow = require( 'meow' );

// Project
const frontburner = require( './' );

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

/* -------------------------------------------------- */
/* DECLARE FUNCTIONS */
/* -------------------------------------------------- */

/* -------------------------------------------------- */
/* INIT */
/* -------------------------------------------------- */
frontburner( cli.input, cli.flags )
	.then( ( output ) => {
		console.log( '`frontburner` process complete.' );
	} )
	.catch( ( err ) => {
		console.log( chalk.red( err.message || err ) );
	} );
