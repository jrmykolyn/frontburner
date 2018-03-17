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
		ARGS = ( Array.isArray( args ) && args.length ) ? args : [];
		OPTIONS = ( !!opts && typeof opts === 'object' ) ? opts : {};

		let optsObj = {};

		if ( Object.keys( OPTIONS ).length ) {
			Object.keys( OPTIONS ).forEach( ( k ) => {
				// Validate and migrate 'OPTIONS' prior to merge with defaults.
				// NOTE:
				// - Option-specific parsing applied via `swith/case`.
				// - To be replaced if `meow` API is updated (see: https://github.com/sindresorhus/meow/issues/81).
				if ( typeof config[ k ] !== 'undefined' )  {
					switch ( k ) {
						case 'keywords':
							optsObj[ k ] = OPTIONS[ k ].split( ',' );
							break;

						default:
							optsObj[ k ] = OPTIONS[ k ];
					}
				}


			} );
		}

		// NOTE: In case of an array collision, the values provided via the command line OVERWRITE the defaults.
		SETTINGS = merge( config, optsObj, {
			arrayMerge: ( a, b ) => { return b; }
		} );

		return this;
	}

	/**
	 * Function returns the `ARGS` variable to the outer context.
	 *
	 * @return {Object}
	 */
	getArgs() {
		return ARGS;
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
