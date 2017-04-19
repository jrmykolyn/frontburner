/* global
	describe
	it
	expect
*/

var InputParser = require( '../lib/input-parser' );

describe( 'Test "InputParser"', function() {
	it ( 'Should return `undefined` when instantiated with an empty array.', function() {
		try {
			var inputParser = new InputParser( [] );
		} catch ( err ) {
			// console.log( err );
		}

		expect( typeof inputParser ).toBe( 'undefined' );
	} );

	it ( 'Should instantiate successfully when provided with a single, Array-type argument.', function() {
		var inputParser = new InputParser( [ 1, 2, 3, 4, 5 ] );

		expect( inputParser instanceof InputParser ).toBe( true );
	} );
} );
