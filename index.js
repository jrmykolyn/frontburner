/* -------------------------------------------------- */
/* IMPORT MODULES */
/* -------------------------------------------------- */
const fs = require( 'fs' );
const StringDecoder = require( 'string_decoder' ).StringDecoder;

/* -------------------------------------------------- */
/* DECLARE VARS */
/* -------------------------------------------------- */
const decoder = new StringDecoder( 'utf8' );

const ARGS = process.argv.slice( 2 ) || [];

var fileName = null;
var filePath = null;

/* -------------------------------------------------- */
/* INIT */
/* -------------------------------------------------- */
if ( !ARGS || !ARGS.length ) {
	/// TODO[@jrmykolyn] - Display warning/error/menu.
} else {
	fileName = ARGS[ 0 ];

	switch ( fileName ) {
		case '*':
		case '.':
			/// TODO[@jrmykolyn] - Handle recursive 'scan' of subfolders.'
			console.error( 'Whoops! The following option isn\'t currently supported: ', fileName );

			break;
		default:
			filePath = process.cwd() + '/' + fileName;

			fs.readFile( filePath, ( err, data ) => {
				if ( err ) {
					console.log( 'Whoops! Something went wrong!' );
					return;
				}

				if ( data instanceof Buffer ) {
					console.log( decoder.write( data ) );
				} else {
					/// TODO[@jrmykolyn] - Handle case where data *IS NOT* a Buffer instance.
				}
			} );
	}
}
