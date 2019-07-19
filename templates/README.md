# Node-RED Master project

This folder is a template master project folder for running Node-RED
as a locally installed package. It contains an npm package.json file that will install Node-RED and the command line admin app & will then be ready to run.

## Getting Started

1. Make sure that you have Node.JS correctly installed. Check that you can run it manually from the command line with `node --version && npm --version`.
2. Make sure that Node.js is at least at version 8.16.0 (LTS) or above.
3. For ease of use, install this package globally with `npm install -g alternate-node-red-installer`. You may need to use a command line with elevated rights (`sudo` on Linux).

Now, from any command line, you should be able to run the following:

```
alternate-node-red-installer -f <root folder name>
```

Where <root folder name>` is a relative or absolute folder path that you want to be the root of your new Node-RED installation.

Example (for Mac, Linux or Windows PowerShell):

```
alternate-node-red-installer -f ~/nrtest
```

Once the install has completed (it may take some time), you can navigate to the data sub-folder and work with Node-RED as normal (e.g. `cd ~/nrtest/data`).

You may wish to adjust the `settings.js` file and install any required Nodes at this point.

Run `npm run` to see the run commands available for your convenience. They are detailed below.

These instructions should work on any platform supported by Node.JS.


## Structure

* [`./data/`](./data) - contains a template `userDir` folder that should be used when running Node-RED this way.
  See that folder's `README.md` file for more information.
* [`./package.json`](./package.json) - contains the single dependency and some handy run scripts

# Run Scripts

These are defined in the [`package.json`](package.json) file:

* **start** - Manually start Node-RED using the local `userDir` folder (`./data`).
* **admin** - Run the command line Node-RED admin tool manually.
* **inspect** - Manually start Node-RED with Node.JS's inspector option for debugging.

* **check** - Run `npm outdated` against this project folder.
* **update** - Update Node-RED and node-red-admin by reinstalling (correctly uses the `--unsafe-perm` & `--production` parameters).
* **check-master** - Run `npm outdated` against this project folder.
* **update-master** - Update Node-RED and node-red-admin by reinstalling (correctly uses the `--unsafe-perm` & `--production` parameters).
* **check-data** - Run `npm outdated` against the `./data` userDir subfolder. This checks for any outdated nodes.
* **update-data** - Run `npm update` against the `./data` userDir subfolder. This will update all installed, outdated nodes.

* **restart** (Linux Only) - Restarts Node-RED via the `systemd` control command. **NOTE**: Assumes that your `systemd` startup script for Node-RED is identified as `node-red`. If it isn't, you will need to alter this.
* **log** (Linux Only) - Display any new lines from the systemd defined log for Node-RED using the `journalctl` command. **NOTE**: Assumes that your `systemd` startup script for Node-RED is identified as `node-red`. If it isn't, you will need to alter this.

* **adminui** (Windows Only) - For Windows users, will open your default browser to the Node-RED Administration page.
* **ui** (Windows Only) - For Windows users, will open your default browser to the Node-RED Dashboard (UI) page if you have one configured.

* **postinstall** - Runs automatically after `npm install ...`. ~~Adjusts some files to match the installed location.~~ not currently in use.

Each can be run by issuing the command `npm run <scriptName>`. However the `run` part is optional for `start` and `restart`.
