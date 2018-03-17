/* global
	describe
	it
	expect
*/

const InputParser = require( '../lib/input-parser' );

describe( 'Test "InputParser"', function() {
	it( 'Should instantiate successfully when provided with an empty array.', function() {
		let inputParser;

		try {
			inputParser = new InputParser( [] );
		} catch ( err ) {
			// console.log( err );
		}

		expect( inputParser instanceof InputParser ).toBe( true );
	} );

	it( 'Should instantiate successfully when provided with a single, Array-type argument.', function() {
		let inputParser = new InputParser( [ 'path/to/file' ] );

		expect( inputParser instanceof InputParser ).toBe( true );
	} );

	it( 'Should return an empty object if instantiated with an argument of insufficient length.', function() {
		let inputParser = new InputParser( [ 'path/to/file' ] );
		let options = inputParser.getOptions();

		expect( !!options && typeof options === 'object' ).toBe( true );
	} );

	it( 'Should return an array of arguments data when the `#getArgs` method is called.', function() {
		let inputParser = new InputParser( [ 'path/to/file' ] );

		expect( Array.isArray( inputParser.getArgs() ) ).toBe( true );
	} );

	it( 'Should return a object of settings data when the `#getSettings` method is called.', function() {
		let inputParser = new InputParser( [ 'path/to/file' ] );

		expect( typeof inputParser.getSettings() ).toBe( 'object' );
	} );

	it( 'Should return the corresponding value when the `#getOption` method is called.', function() {
		let inputParser = new InputParser( [ 'path/to/file' ], { testOption: 'Test Value' } );

		expect( inputParser.getOption( 'testOption' ) ).toBe( 'Test Value' );
	} );
} );
