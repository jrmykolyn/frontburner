// --------------------------------------------------
// DECLARE `ESLint` GLOBALS
// --------------------------------------------------
/* global
	console
*/

// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Project
const config = require( '../config/frontburner.config.js' );

// Vendor
const merge = require( 'deepmerge' );

// --------------------------------------------------
// DECLARE VARS
// --------------------------------------------------
var ARGS = [];
var OPTIONS = [];
var SETTINGS = {};

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function InputParser( args ) {
	ARGS = ( Array.isArray( args ) && args.length ) ? args : null;
	OPTIONS = ( Array.isArray( ARGS ) && ARGS.length ) ? ARGS.slice( 1 ) : [];

	if ( !ARGS ) {
		throw new Error( 'Whoops! Frontburner requires at least one argument.' );
	}

	let optsObj = {};

	if ( OPTIONS.length ) {
		optsObj = _getOptionsObjFromArr( OPTIONS );

		Object.keys( optsObj ).forEach( ( k ) => {
			if ( typeof config[ k ] === 'undefined' )  {
				delete optsObj[ k ];
			}
		} );
	}

	SETTINGS = merge( config, optsObj );

	return this;
}

/**
 * ...
 */
InputParser.prototype.getSettings = function() {
	return SETTINGS;
};

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
 * Function returns the `OPTIONS` variable to the outer context.
 *
 * @return {Array}
 */
InputParser.prototype.getOptions = function() {
	return OPTIONS;
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

/**
 * ...
 */
function _getOptionsObjFromArr( arr ) {
	return arr.filter( ( opt ) => {
		return ( typeof opt === 'string' && opt.substring( 0, 1 ) === '-' );
	} )
	.map( _destructureOpt )
	.reduce( ( a1, a2 ) => {
		return Object.assign( a1, a2 );
	}, {} );
}

function _destructureOpt( opt ) {
	if ( !opt || typeof opt !== 'string' ) {
		return {};
	}

	if ( opt.substring( 0, 2 ) === '--' ) {
		let optArr = opt.substring( 2 ).split( '=' );
		let k = optArr[ 0 ];
		let v = _parseOptValue( optArr[ 1 ] );

		return { [ k ]: v };
	}

	if ( opt.substring( 0, 1 ) === '-' ) {
		return { [ opt.substring( 1 ) ]: true };
	}
}

function _parseOptValue( value ) {
	if ( !value || typeof value !== 'string' ) {
		return true;
	}

	if ( value.indexOf( ',' ) >= 0 ) {
		return value.split( ',' );
	} else {
		return value;
	}
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = InputParser;
