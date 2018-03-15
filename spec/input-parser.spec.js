/* global
	describe
	it
	expect
*/

const InputParser = require( '../lib/input-parser' );

describe( 'Test "InputParser"', function() {
	it( 'Should return `undefined` when instantiated with an empty array.', function() {
		let inputParser;

		try {
			inputParser = new InputParser( [] );
		} catch ( err ) {
			// console.log( err );
		}

		expect( typeof inputParser ).toBe( 'undefined' );
	} );

	it( 'Should instantiate successfully when provided with a single, Array-type argument.', function() {
		let inputParser = new InputParser( [ 'path/to/file', '--display' ] );

		expect( inputParser instanceof InputParser ).toBe( true );
	} );

	it( 'Should return an empty object if instantiated with an argument of insufficient length.', function() {
		let inputParser = new InputParser( [ 'path/to/file' ] );
		let options = inputParser.getOptions();

		expect( !!options && typeof options === 'object' ).toBe( true );
	} );

	it( 'Should return a object of settings data when the `#getSettings` method is called.', function() {
		let inputParser = new InputParser( [ 'path/to/file' ] );

		expect( typeof inputParser.getSettings() ).toBe( 'object' );
	} );

	/// TODO[@jrmykolyn]: Write test(s) for `#getOption()`.
} );
