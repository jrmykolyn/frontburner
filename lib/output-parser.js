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
class OutputParser {
	/**
	 * Function assembles and returns a timestamped 'output' file name.
	 *
	 * @return {String}
	 */
	getLogName() {
		let base = config.logFile.base || 'frontburner';
		let extension = config.logFile.extension || '.log';
		let timestamp = new Date().getTime();

		return ( `${base}_${timestamp}${extension}` );
	}

	/**
	 * Function generates a new file with the provided `outputText` in the current working directory.
	 */
	writeLog( outputText ) {
		let logName = this.getLogName();

		fs.writeFile( `${process.cwd()}/${logName}`, outputText, ( err ) => {
			if ( err ) {
				console.error( 'Whoops! Something went wrong!' );
				return;
			}

			console.log( `Successfully created: ${logName}` );
		} );
	}
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = OutputParser;
