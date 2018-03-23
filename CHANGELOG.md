# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- Add support for targeting folders by name (eg. `fbr /path/to/folder/`). (topic-7)

## [0.2.2] - 2018-03-16
### Added
- Add support for `--prefixes` flag.
- Add support for `--excludes` flag.
- Add [`meow`](npmjs.com/package/meow) to dependencies. (topic-2)

### Changed
- ES6-ify module files. (topic-1)
- Update module to use [`meow`](npmjs.com/package/meow) in place of bespoke input/argument parsing functions. (topic-2)
- Update `README.md`. (topic-2)
- Improve handling of `--keywords` CLI flag. (topic-5)
- Resolve outstanding 'TODO' items. (topic-4)

### Removed
- Remove `Logger` module and related tests. (topic-2)

## [0.2.1] - 2017-09-11
### Changed
- Fixed issue where 'multifile' scanning (eg. `fbr .`) would log `frontburner` internal TODOs rather than current working directory.

## [0.2.0] - 2017-09-06
### Added
- Added support for 'multifile' scanning (triggered when `fbr` is invoked with either of the following values as the first argument: `.`; `*`).
- Updated program to output file meta info.
- Added 'prefixes' array to project configuration.
- Added `Jasmine` testing framework to project.
- Added development dependencies: `bluebird`; `recursive-readdir`.
- Added `package-lock.json` file.

### Changed
- Updated `InputParser` to parse/return options.
- Updated program to check for presence of 'prefix' when 'scanning' input for keywords.
- Moved argument/option parsing logic into dedicated module (`lib/input-parser.js`).
- Moved file parsing logic into dedicated module (`lib/file-parser.js`).
- Moved log/printing logic into dedicated module (`lib/logger.js`).
- Moved file writing logic into dedicated module (`lib/output-parser.js`);

## [0.1.2] - 2017-04-17
### Added
- Added ESLint config. file to project.

### Changed
- Fixed formatting in 'index.js', as per ESLint flags.

## [0.1.1] - 2017-04-17
### Added
- Added support for 'help' command (eg. `fbr help`).

### Changed
- Fixed issue where intended behaviour was logging error messages to stdout.

## [0.1.0] - 2017-04-14
### Added
- Added project configuration file ('config/frontburner.config.js').
- Added support for command line use via the `fbr` command (eg. `fbr path/to/my/file`).

### Changed
- Moved 'hardcoded' keywords into project configuration file.
- Added support for 'keywords' option (eg. `--keywords=FIXME,TODO`). Keywords specified in this way will override the program defaults.
- Added support for 'display' option (eg.` --display`). Including this option prevents the creation of a new log file, and prints the results of the current scan to stdout.

## [0.0.2] - 2017-04-14
### Added
- 'index.js': entry point into Frontburner; contains main/primary program logic.
- 'temp/': contains temporary files that are required for initial development and testing.

## [0.0.1] - 2017-04-14
### Added
- Basic project configuration files (eg. `.git`, `.editorconfig`, `package.json`, etc.)
- 'README': file includes initial description of project, as well as 'MVP' and 'supplementary' requirements.
- 'CHANGELOG'.
