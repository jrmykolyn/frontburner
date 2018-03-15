/* global
	describe
	it
	expect
*/

const Logger = require( '../lib/logger' );

describe( 'Test "Logger"', function() {
	it( 'Should return the help menu when the `#help` method is called.', function() {
		let logger = new Logger();

		expect( typeof logger.help() ).toBe( 'string' );
	} );
} );
