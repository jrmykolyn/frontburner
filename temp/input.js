/* global
	console
*/

( function() {
	// @todo - Test alternative 'TODO' syntax.

	/// TODO - Document function.
	function doThing( num ) {
		/// TEMP - Remove log before deploying to production.
		console.log( 'INSIDE `doThing()`' );

		/// FIXME - Update function to use variable instead of 'magic number' 5.
		return ( num >= 5 );
	}

	doThing( 5 );
} );
