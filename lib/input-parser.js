// --------------------------------------------------
// DECLARE `ESLint` GLOBALS
// --------------------------------------------------
/* global */

// --------------------------------------------------
// DECLARE VARS
// --------------------------------------------------
var ARGS = [];
var OPTIONS = [];

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function InputParser( args ) {
	ARGS = ( Array.isArray( args ) && args.length ) ? args : null;
	OPTIONS = ( Array.isArray( ARGS ) && ARGS.length ) ? ARGS.slice( 1 ) : [];

	if ( !ARGS ) {
		/// TODO[@jrmykolyn] - Throw error.
	}

	return this;
}

/**
 * Function extracts and returns a 'keywords' array from `OPTIONS`.
 *
 * If the desired 'option' is not found, function returns `null`.
 *
 * @return {Null|Array}
 */
InputParser.prototype.getKeywords = function() {
	if ( !OPTIONS ) { return null; }

	var keywordsString = this.getOption( '--keywords' );
	var keywordsArr = null;

	try {
		keywordsArr = keywordsString.split( '=' )[ 1 ].split( ',' );

		return ( Array.isArray( keywordsArr ) && keywordsArr.length ) ? keywordsArr : null;
	} catch ( err ) {
		return null;
	}
};

/**
 * Given a specific option, function returns it (including the key, value, and delimiter) if present within the `OPTIONS` array.
 *
 * @param {String} `option`
 * @return {Null|String}
 */
InputParser.prototype.getOption = function( option ) {
	// Validate/re-assign args.
	option = ( option && typeof option === 'string' ) ? option : null;

	// Return `null` if `option` or `OPTIONS` missing/invalid.
	if ( !option || !OPTIONS ) { return null; }

	// Return first matched option or `null`.
	return OPTIONS.filter( ( opt ) => { return opt.includes( option ); } )[ 0 ] || null;
};

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = InputParser;
