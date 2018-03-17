# Frontburner

## Introduction
Frontburner is a command line tool which scans project files and outputs a list/log of any 'FIXME', 'TODO' or related inline notes.

## Requirements (MVP)
- Program must be run from the command line (via the `fbr` command).
- Program must display a list of available options (and/or the help command) if invoked without arguments.
- Program must allow for 'scanning' of single files.
- When invoked with valid arguments, the results of a given 'scan' must printed to a *new* document in the current directory (document name TBD).
- Program must allow for the results of a given 'scan' to be printed to `stdout` (via the `--display` option).

## Requirements (Supplementary)
- Program should allow for recursive 'scanning' of all subfolders within current directory.
- Program should allow for filtering of 'scan' results by 'handle' (eg. 'FIXME' vs. 'FIXME[@johnsmith]'). Filtering pattern TBD.
- Output file *name* should contain name of 'scanned' file or pattern.
- Output file should contain a line number for each matched note.
- Program should only match commented out keywords.
