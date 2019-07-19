# Node-RED userDir

This folder is where Node-RED will find all of its user working files if you are using the [Alternate Node-RED Installer](https://github.com/TotallyInformation/alternate-node-red-installer).

See the [Readme](../README.md) file for the parent master template folder for details on how to install and get set up. Also for why you might want to set up Node-RED this way.

Normally, you would anticipate finding the userDir folder at `~/.node-red`. But this restricts you to only having a single instance of Node-RED on a device and pollutes the users home folder.

This alternate installation method allows multiple instances of Node-RED very easily - even at different version levels. It also keeps everything together under a single folder hierarchy making backup and recovery a lot easier.
