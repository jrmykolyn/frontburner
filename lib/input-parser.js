// --------------------------------------------------
// DECLARE `ESLint` GLOBALS
// --------------------------------------------------
/* global */

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
let ARGS = [];
let OPTIONS = [];
let SETTINGS = {};

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
class InputParser {
	constructor( args, opts ) {
		ARGS = ( Array.isArray( args ) && args.length ) ? args : null;
		OPTIONS = ( !!opts && typeof opts === 'object' ) ? opts : {};

		if ( !ARGS ) {
			throw new Error( 'Whoops! Frontburner requires at least one argument.' );
		}

		let optsObj = {};

		if ( Object.keys( OPTIONS ).length ) {
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
	 * Function returns the `SETTINGS` variable to the outer context.
	 *
	 * @return {Object}
	 */
	getSettings() {
		return SETTINGS;
	}

	/**
	 * Function returns the `OPTIONS` variable to the outer context.
	 *
	 * @return {Array}
	 */
	getOptions() {
		return OPTIONS;
	}

	/**
	 * Given a specific option, function returns it (including the key, value, and delimiter) if present within the `OPTIONS` array.
	 *
	 * @param {String} `option`
	 * @return {Null|String}
	 */
	getOption( option ) {
		// Validate/re-assign args.
		option = ( option && typeof option === 'string' ) ? option : null;

		// Return `null` if `option` or `OPTIONS` missing/invalid.
		if ( !option || !OPTIONS ) { return null; }

		return OPTIONS[ option ];
	}
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = InputParser;
