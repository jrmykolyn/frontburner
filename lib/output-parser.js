// --------------------------------------------------
// DECLARE `ESLint` GLOBALS
// --------------------------------------------------
/* global
	process
	console
*/

// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Node
const fs = require( 'fs' );

// Project
const config = require( '../config/frontburner.config.js' );

// --------------------------------------------------
// DECLARE VARS
// --------------------------------------------------

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function OutputParser() {
	return this;
}

/**
 * Function assembles and returns a timestamped 'output' file name.
 *
 * @return {String}
 */
OutputParser.prototype.getLogName = function() {
	let base = config.logFile.base || 'frontburner';
	let extension = config.logFile.extension || '.log';
	let timestamp = new Date().getTime();

	return ( `${base}_${timestamp}${extension}` );
};

/**
 * Function generates a new file with the provided `outputText` in the current working directory.
 */
OutputParser.prototype.writeLog = function( outputText ) {
	fs.writeFile( `${process.cwd()}/${this.getLogName()}`, outputText, ( err ) => {
		if ( err ) {
			console.error( 'Whoops! Something went wrong!' );
			return;
		}

		console.log( 'Success!' ); /// TODO[@jrmykolyn] - Update 'success' message to include useful info.
	} );
};

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = OutputParser;
