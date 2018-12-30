# Node-RED Master project

This folder is a template master project folder for running Node-RED
as a locally installed package. It contains an npm package.json file that will install Node-RED and the command line admin app & will then be ready to run.

## Getting Started

1. Make sure that you have Node.JS correctly installed. Check that you can run it manually from the command line with `node --version && npm --version`.
2. Copy this template folder and the [`./data`](data/) subfolder to any convenient location on the device where you want Node-RED to run.
   Note that you can [copy this whole repository by clicking on this link](https://github.com/TotallyInformation/alternate-node-red-installer/archive/master.zip). You can then unzip it and copy the template folder.
3. From a command line, navigate to the folder created in step 2 and run `npm run update`. This will install Node-RED and the admin tool.
4. Run Node-RED manually by issuing the command `npm start`. You will see the Node-RED log output in the terminal and it should start correctly.

These instructions should work on any platform supported by Node.JS.


## Structure

* [`./data/`](./data) - contains a template `userDir` folder that should be used when running Node-RED this way.
  See that folder's `README.md` file for more information.
* [`./package.json`](./package.json) - contains the single dependency and some handy run scripts

# Run Scripts

These are defined in the [`package.json`](package.json) file:

* **start** - Manually start Node-RED using the local `userDir` folder (`./data`).
* **admin** - Run the command line Node-RED admin tool manually.

* **check** - Run `npm outdated` against this project folder.
* **update** - Update Node-RED and node-red-admin by reinstalling (correctly uses the `--unsafe-perm` parameter).
* **check-master** - Run `npm outdated` against this project folder.
* **update-master** - Update Node-RED and node-red-admin by reinstalling (correctly uses the `--unsafe-perm` parameter).
* **check-data** - Run `npm outdated` against the `./data` userDir subfolder. This checks for any outdated nodes.
* **update-data** - Run `npm update` against the `./data` userDir subfolder. This will update all installed, outdated nodes.

* **restart** (Linux Only) - Restarts Node-RED via the `systemd` control command. **NOTE**: Assumes that your `systemd` startup script for Node-RED is identified as `node-red`. If it isn't, you will need to alter this.
* **log** (Linux Only) - Display any new lines from the systemd defined log for Node-RED using the `journalctl` command. **NOTE**: Assumes that your `systemd` startup script for Node-RED is identified as `node-red`. If it isn't, you will need to alter this.

* **adminui** (Windows Only) - For Windows users, will open your default browser to the Node-RED Administration page.
* **ui** (Windows Only) - For Windows users, will open your default browser to the Node-RED Dashboard (UI) page if you have one configured.

* **postinstall** - Runs automatically after `npm install ...`. Adjusts some files to match the installed location.

Each can be run by issuing the command `npm run scriptName`. However the `run` part is optional for `start` and `restart`.
