/* global
	describe
	it
	expect
*/

var FileParser = require( '../lib/file-parser' );

describe( 'Test "FileParser"', function() {
	it( 'Should allow instantiation with no arguments.', function() {
		var fileParser = new FileParser();

		expect( fileParser instanceof FileParser ).toBe( true );
	} );

	it( 'Should throw an error when the `#addFile` method is called with no arguments.', function() {
		var fileParser = new FileParser();

		try {
			fileParser.addFile();
		} catch( err ) {
			expect( err instanceof Error ).toBe( true );
		}
	} );

	it( 'Should increase the number of files when the `#addFile` method is called correctly.', function() {
		var fileParser = new FileParser();

		fileParser.addFile( {
			meta: {},
			data: ''
		} );

		expect( fileParser.getTotalFiles() ).toBe( 1 );
	} );

	it( 'Should return an object of file data when the #getFile method is called.', function() {
		var fileParser = new FileParser();

		fileParser.addFile( {
			meta: {},
			data: ''
		} );

		expect( typeof fileParser.getFile() ).toBe( 'object' );
	} );

	it( 'Should parse the contents of the internal/private files and return the results as a string.', function() {
		var fileParser = new FileParser();

		fileParser.addFile( {
			meta: {},
			data: ''
		} );

		expect( typeof fileParser.parse() ).toBe( 'string' );
	} );
} );
