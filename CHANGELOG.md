# Change Log

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

alternate-node-red-installer adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/TotallyInformation/alternate-node-red-installer/compare/v1.0.0...master)

### Breaking

- Node.js v10 is now the minimum version due to dependency module changes.

### Added

- [CHANGELOG](./CHANGELOG.md) and [TODO](./TODO.md) files.
- Two command line commands are now available if you install this package globally:
   - `alternate-node-red-installer` - OK, so this is a bit long and I can never remember it myself!
   - `nrinstall` - Yes, that's a bit more memorable. 😎

### Changed

- Bump to v2.0 due to breaking change. And to v2.0.1 for the extra command name.
- Bump dependencies to latest versions.
- Tidy and improve code.
- Install now sets correct paths in `./system/node-red-service` and `./data/envfile.ini`.

----

## [1.0.0](https://github.com/TotallyInformation/alternate-node-red-installer/compare/v0.0.1...v1.0.0) - 

### Fixed
