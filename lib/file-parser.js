// --------------------------------------------------
// DECLARE `ESLint` GLOBALS
// --------------------------------------------------
/* global */

// --------------------------------------------------
// IMPORT MODULES */
// --------------------------------------------------
// Project
const config = require( '../config/frontburner.config.js' ) || {};

// Vendor
const lineNumber = require( 'line-number' );

// --------------------------------------------------
// DECLARE VARS
// --------------------------------------------------
const FILES = [];

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
class FileParser {
	/**
	 * Function parses the contents of the private `FILES` array.
	 *
	 * @return {String}
	 */
	parse() {
		let output = '';

		FILES.forEach( ( file ) => {
			let obj = {};

			obj.meta = file.meta || {};
			obj.matches = this.getInlineNotes( file.data, config.keywords );

			output += this.formatNoteObj( obj );
		} );

		return output;
	};

	/**
	 * Given a `file` object, function adds it to the private `FILES` array.
	 */
	addFile( file ) {
		if ( !file ) {
			throw new Error( '...' ); /// TODO[@jrmykolyn] - Add meaningful error message.
		}

		FILES.push( file );
	};

	/**
	 * Function returns the total number of files stored by the file parser.
	 *
	 * @return {Number}
	 */
	getTotalFiles() {
		return FILES.length || 0;
	};

	/**
	 * Function returns the first file in the private `FILES` array.
	 *
	 * @return {Object}
	 */
	getFile() {
		return FILES[ 0 ];
	};

	/**
	 * Given an `input` string, function returns an object containing all occurrences of the specified `keywords`.
	 *
	 * @param {String} `input` - The text content to check.
	 * @param {Array} `keywords` - The keywords to check for.
	 * @return {Object}
	 */
	getInlineNotes( file, keywords ) {
		let output = {};
		let prefixCaptureGroup = this.getPrefixCaptureGroup( config.prefixes );

		// Check `input` for text matching each of the `keywords`.
		keywords.forEach( ( keyword ) => {
			let pattern = new RegExp( `${prefixCaptureGroup}\\s*${keyword}(.*)$`, 'gmi' );
			let matches = lineNumber( file, pattern );

			// NOTE: `lineNumber` returns an empty array on 'no match'.
			if ( matches && Array.isArray( matches ) && matches.length ) {
				output[ keyword ] = matches;
			} else {
				output[ keyword ] = null;
			}
		} );

		return output;
	};

	/**
	 * Given a `noteObj`, function generates a human-readable version of the included data.
	 *
	 * @param {Object} `noteObj` - An object of 'inline note' data.
	 * @return {String}
	 */
	formatNoteObj( noteObj ) {
		noteObj = ( noteObj && typeof noteObj === 'object' ) ? noteObj : null;

		let output = '';

		// Only print data if current 'note object' includes at least 1x 'match'.
		if ( Object.keys( noteObj.matches ).some( ( k ) => { return !!noteObj.matches[ k ]; } ) ) {
			// Print 'meta'.
			output += '\n';
			output += '---\n';
			for ( let key in noteObj.meta ) {
				output += `${ key }: ${ noteObj.meta[ key ] }`;
				output += '\n';
			}
			output += '---\n';

			// Print 'matches'.
			for ( let key in noteObj.matches ) {
				if ( noteObj.matches[ key ] && Array.isArray( noteObj.matches[ key ] ) && noteObj.matches[ key ].length ) {

					noteObj.matches[ key ].forEach( ( obj ) => {
						output += `${obj.number.toString().padStart( 6 )} | ${obj.match}\n`;
					} );

					output += '\n';
				}
			}
		}

		return output;
	};

	/**
	 * Given an array of strings, functions returns a regex capture group.
	 *
	 * Note that certain special characters (eg. '/', '*', etc.) are escaped.
	 *
	 * @param {Array} `prefixes`
	 * @return {String}
	 */
	getPrefixCaptureGroup( prefixes ) {
		return `(${prefixes.map( this.escapeSpecialChars ).join( '|' )})`;
	};

	/**
	 * Given a string, function escapes any special characters and returns the result.
	 *
	 * Note that the special characters are matched against a 'whitelist' defined within the function body.
	 *
	 * @param {String} `str`
	 * @return {String}
	 */
	escapeSpecialChars( str ) {
		let specialChars = [ '/', '*' ]; /// TODO[@jrmykolyn] - Move collection of special chars. into config. var.

		if ( !str || typeof str !== 'string') {
			return str;
		}

		return str.split( '' )
			.map( ( char ) => {
				return ( specialChars.includes( char ) ) ? '\\' + char : char; // NOTE - Extra '\' character required in order to escape... the escape...
			} )
			.join( '' );
	};
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = FileParser;
