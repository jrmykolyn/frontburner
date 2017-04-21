// --------------------------------------------------
// DECLARE `ESLint` GLOBALS
// --------------------------------------------------
/* global */

// --------------------------------------------------
// IMPORT MODULES */
// --------------------------------------------------
// Project
const config = require( '../config/frontburner.config.js' ) || {};

// --------------------------------------------------
// DECLARE VARS
// --------------------------------------------------
var FILES = [];

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function FileParser() {
	return this;
}

/**
 * Function parses the contents of the private `FILES` array.
 *
 * @return {String}
 */
FileParser.prototype.parse = function() {
	var output = '';

	FILES.forEach( ( file ) => {
		var obj = {};

		obj.meta = file.meta || {};
		obj.matches = this.getInlineNotes( file.data, config.keywords );

		output += this.formatNoteObj( obj );
	} );

	return output;
};

/**
 * Given a `file` object, function adds it to the private `FILES` array.
 */
FileParser.prototype.addFile = function( file ) {
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
FileParser.prototype.getTotalFiles = function() {
	return FILES.length || 0;
};

/**
 * Function returns the first file in the private `FILES` array.
 *
 * @return {Object}
 */
FileParser.prototype.getFile = function() {
	return FILES[ 0 ];
};

/**
 * Given an `input` string, function returns an object containing all occurrences of the specified `keywords`.
 *
 * @param {String} `input` - The text content to check.
 * @param {Array} `keywords` - The keywords to check for.
 * @return {Object}
 */
FileParser.prototype.getInlineNotes = function( file, keywords ) {
	var output = {};
	var prefixCaptureGroup = this.getPrefixCaptureGroup( config.prefixes );

	// Check `input` for text matching each of the `keywords`.
	keywords.forEach( ( keyword ) => {
		let pattern = new RegExp( `${prefixCaptureGroup}\\s*${keyword}(.*)$`, 'gmi' );

		output[ keyword ] = file.match( pattern );
	} );

	return output;
};

/**
 * Given a `noteObj`, function generates a human-readable version of the included data.
 *
 * @param {Object} `noteObj` - An object of 'inline note' data.
 * @return {String}
 */
FileParser.prototype.formatNoteObj = function( noteObj ) {
	noteObj = ( noteObj && typeof noteObj === 'object' ) ? noteObj : null;

	var output = '';

	// Print 'meta' info.
	output += '==================================================';
	output += '\n';
	for ( let key in noteObj.meta ) {
		output += `${ key }: ${ noteObj.meta[ key ] }`;
		output += '\n';
	}
	output += '==================================================';
	output += '\n\n';

	// Print 'matches' info.
	for ( let key in noteObj.matches ) {
		if ( noteObj.matches[ key ] && Array.isArray( noteObj.matches[ key ] ) ) {
			output += `${key}\n`;
			output += '--------------------------------------------------';
			output += '\n';
			output += noteObj.matches[ key ].reduce( ( a1, a2 ) => { return `${a1}\n${a2}\n`; } );
			output += '\n\n';
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
FileParser.prototype.getPrefixCaptureGroup = function( prefixes ) {
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
FileParser.prototype.escapeSpecialChars = function( str ) {
	var specialChars = [ '/', '*' ]; /// TODO[@jrmykolyn] - Move collection of special chars. into config. var.

	if ( !str || typeof str !== 'string') {
		return str;
	}

	return str.split( '' )
		.map( ( char ) => {
			return ( specialChars.includes( char ) ) ? '\\' + char : char; // NOTE - Extra '\' character required in order to escape... the escape...
		} )
		.join( '' );
};

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = FileParser;
