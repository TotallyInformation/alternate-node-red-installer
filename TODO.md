# Alternate Node-RED Installer: To Do

https://discourse.nodered.org/t/advice-setting-up-node-red-for-a-class/16650

- Allow `userDir` folder to be specified.
- Allow for an alternate templates folder.
- Add instructions for customised installs.
- Add an interactive mode.
- Allow for configuration file.
- Additional Optional tasks
   - `npm install` in master folder (allows for custom templates to pre-install protected nodes)
   - `npm install` in userDir folder (allows for custom templates to pre-install nodes)
   - Change `<userDir>/.config.json` to include any nodes installed above.
   - Initialise git in master folder
   - Initialise git in userDir folder
   - 

## Future Thoughts

These would be interesting extensions. I might one-day get to doing them.

* Create a post-install script that:
   * Tweaks the template systemd service definition
   * Creates a Windows scheduler template allowing Node-RED to be run as a service on Windows 10
* Create a script for Linux that installs the systemd service definition
* Create a sdript for Windows that installs Node-RED as a Windows Service
* Allow a configuration file to install required Nodes and change `settings.js`
* Allow settings overrides to be merged with the master settings.js that is copied from the Node-RED package - this would allow for changes to the master while keeping your custom settings. This is a potential issue with the normal installation when the settings.js file changes.
