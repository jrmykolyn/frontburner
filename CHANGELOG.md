# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

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
