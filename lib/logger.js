// --------------------------------------------------
// DECLARE `ESLint` GLOBALS
// --------------------------------------------------
/* global
	console
*/

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function Logger() {
	return this;
}

/**
 * Function returns the 'help' menu.
 *
 * @return {String}
 */
Logger.prototype.help = function() {
	var output = '';

	output += '--------------------------------------------------';
	output += 'INTRO';
	output += '---------------';
	output += 'Frontburner is designed to be run from the command line using the `fbr` command.';
	output += 'Start with the command, followed by the name of the file that you want to \'scan\'.';
	output += '\n';
	output += 'EXAMPLE:';
	output += '---------------';
	output += 'fbr path/to/my/file';
	output += '\n';
	output += 'OPTIONS:';
	output += '---------------';
	output += '--display';
	output += 'Including this option will log the contents of the \'scan\' to stdout, and suppress the creation of a log file.';
	output += '\r';
	output += 'Usage:';
	output += 'fbr path/to/my/file --display';
	output += '\n';
	output += '--keywords';
	output += 'This option overrides the default \'keywords\' that Frontburner checks for. User selected keywords must be provided as a series of comma separated strings.';
	output += '\r';
	output += 'Usage:';
	output += 'fbr path/to/my/file --keywords=FIXME,TODO';
	output += '--------------------------------------------------';
	output += '\n';

	return output;
};

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = Logger;
