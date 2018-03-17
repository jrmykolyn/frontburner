module.exports = {
	prefixes: [
		'@',
		'/*',
		'[/]{2,}',
	],
	keywords: [
		'FIXME',
		'TEMP',
		'TODO'
	],
	logFile: {
		base: 'frontburner',
		extension: '.log'
	},
	excludes: [
		'node_modules',
		'.git',
		'frontburner*',
	],
	specialChars: [
		'/',
		'*',
	],
};
