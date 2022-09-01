# Change Log

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

alternate-node-red-installer adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/TotallyInformation/alternate-node-red-installer/compare/v2.0.2...master)

None

## [3.0.0](https://github.com/TotallyInformation/alternate-node-red-installer/compare/v2.0.3...v3.0.0)

### Breaking

* Minimum version of Node.js supported is now v12

### Changed

* Dependencies updated (note that several dependencies from Sindresorhus are used - annoyingly he has forced a move to ESM only, this is just too hard to contemplate right now so still using older versions)

### Fixed

* Removed some extraneous quotes

## [2.0.3](https://github.com/TotallyInformation/alternate-node-red-installer/compare/v2.0.2...v2.0.3)

### Added

- An example `settings.js` file (`data/example-settings/js`)

  This contains a number of enhancements over the default including extended information that can be collapsed for easier reading.

  It also is configured to pick up the environment variables specified in this packages templates.
  
- `backup.sh`, `backupw.sh`, and `backupm.sh` BASH scripts in the new `scripts` folder to efficiently back up your working Node-RED installation if installed using this alternate installer.
  
  The scripts should be run from CRON daily, weekly and monthly respectively.

  Please amend the indicated variables in the scripts so that they will work for your own installation.

  ```text
  # Node-RED daily backup (3AM every day)
  0 3 * * * "/home/home/nrmain"/backup.sh > /dev/null
  # Node-RED weekly backup (03:30 every Sunday)
  30 3 * * 0 "/home/home/nrmain"/backupw.sh > /dev/null
  # Node-RED monthly backup (04:00 on the first of every month)
  0 4 1 * * "/home/home/nrmain"/backupm.sh > /dev/null
  ```

  They give you 7 days of daily backups, 5 weekly backups, and 12 monthly backups. They should be easy enough to adapt to whatever schedule you want.

  Output from the scripts are written to syslog, review with `sudo cat /var/log/syslog | grep nrmain-backup` or `sudo journalctl -t nrmain-backup`.

  Note that the backup scripts have been updated for Node-RED v1.3 such that `data/externalModules/node_modules` is excluded.

## [2.0.2](https://github.com/TotallyInformation/alternate-node-red-installer/compare/v1.0.0...v2.0.2)
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
