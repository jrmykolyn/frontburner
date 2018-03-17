# Frontburner

## Table of Contents
- [About](#about)
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Documentation](#documentation)
- [Contributing](#contributing)
	- [Contibuting Overview](#contributing-overview)
	- [Code Style](#code-style)
	- [Testing](#testing)

## About
Frontburner is a command line tool which scans project files and outputs a list/log of any 'FIXME', 'TODO' or related inline notes.

## Installation
Install Frontburner via the npm package registry as follows:

```
npm install -g frontburner
```

This exposes the global `fbr` command.

## Setup
No additional setup is requred.

## Usage
After installation, invoke the following command for detailed usage instructions:

```
fbr --help
```

## Documentation
Currently, Frontburner does not include any external documentation.

For an overview of the project's evolution, please consult the CHANGELOG.

## Contributing

### Contributing Overview
Issue flags and proposed enhancements are welcome!

### Code Style
`ESlint` and `editorconfig` are used to enforce consistent code style and formatting. Please ensure that both of these tools are available within your IDE.

### Testing
To run the test suite, complete the follow steps:
- Clone the repository and navigate to the root folder from the command line.
- Run `npm install`.
- Run `npm test`.
