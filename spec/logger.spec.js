/* global
	describe
	it
	expect
*/

var Logger = require( '../lib/logger' );

describe( 'Test "Logger"', function() {
	it( 'Should return the help menu when the `#help` method is called.', function() {
		var logger = new Logger();

		expect( typeof logger.help() ).toBe( 'string' );
	} );
} );
