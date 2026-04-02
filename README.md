# @totallyinformation/nrinstall

An alternative installer for Node-RED. Avoids global installs, no admin rights required for new Node-RED instances. Local install allows full control and even multiple different versions of Node-RED running in parallel. Works on any platform supported by Node.JS. It also includes an enhanced settings.js example file and some additional utility scripts.

> This solution is particularly suited for development environments and anywhere that you don't want to install global NodeJS scripts. Also when you need to have different versions of Node-RED running in parallel.

> [!NOTE]
> That the npm package name for this repository has changed from [`alternate-node-red-installer`](https://www.npmjs.com/package/alternate-node-red-installer) to [`@totallyinformation/nrinstall`](https://www.npmjs.com/package/@totallyinformation/nrinstall) to allow easier running from `npx`. The old published package has now be deprecated.

## Getting Started

1. Make sure that you have Node.JS correctly installed. Check that you can run it manually from the command line with `node --version && npm --version`.
2. Make sure that Node.js is at least at version 20 (LTS) or above.
3. Run the installer directly with npx:
   
   ```
   npx @totallyinformation/nrinstall -f <root folder name>
   ```
   
    Where <root folder name>` is a relative or absolute folder path that you want to be the root of your new Node-RED installation.

4. Optional: install globally with `npm install -g @totallyinformation/nrinstall`. You may need to use a command line with elevated rights (`sudo` on Linux). Then run as:

   ```
   nrinstall -f <root folder name>
   ```

Example (for Mac, Linux or Windows PowerShell):

```
mkdir ~/nrtest
nrinstall -f ~/nrtest
```

Once the install has completed (it may take some time), you can navigate to the data sub-folder and work with Node-RED as normal (e.g. `cd ~/nrtest/data`).

You may wish to adjust the `./data/settings.js` file. See the `./data/example-settings.js` file for an example enhanced settings file.

Run `npm run` to see the run commands available for your convenience. They are detailed in the README.md file installed in the data subfolder.

These instructions should work on any platform supported by Node.JS.

## Table of Contents

<!-- TOC -->

- [@totallyinformation/nrinstall](#totallyinformationnrinstall)
  - [Getting Started](#getting-started)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [The issue](#the-issue)
  - [The solution](#the-solution)
  - [The advamtages](#the-advamtages)
  - [Starting Node-RED](#starting-node-red)
  - [Updating Node-RED and installed nodes](#updating-node-red-and-installed-nodes)
  - [Changes](#changes)
  - [To Do](#to-do)
  - [Prerequisites](#prerequisites)
  - [Sponsorship](#sponsorship)
  - [Other links](#other-links)

<!-- /TOC -->

## Introduction

Node-RED is a superb, flow-based development and prototyping tool written by IBM to showcase their IoT experience.
It was later gifted to the JavaScript Foundation. It is entirely JavaScript based thanks to NodeJS and a number
of other great libraries such as D3, ExpressJS and JQuery.

I've used it now for a few years to create a custom home automation system and was impressed enough to start trying
to give back to the community.

## The issue

However, I've never personally quite liked the default installation. Don't get me wrong, it is great for beginners
and for people inexperienced with the command line. But for production use and for security, I think that there
is a better way to install and maintain your Node-RED systems.

In particular, Node-RED itself (and the companion node-red-admin module) are normally installed globally.

Not only can this open up security issues by having complex, inexperienced user generated code running under a global
service, it also makes some of the files under the surface difficult to find on the odd occasions you need to.

## The solution

There seems to me to be an easy solution to the global installation issue. This approach is more complex to set up
normally since you don't, of course, get any hand-holding to set it up. And so the idea for this code came about.

The concept is really very simple.

* Create a folder in some convenient location.
* Use the `npm` package manager to install node-red (and node-red-admin if you like) into that folder. `npm install --unsafe-perm --production node-red node-red-admin`
* Create a sub-folder as your `userDir` - the place all of the nodes and your flows and other information is put.
* Create startup and update scripts both for the master folder and the userDir folder using the script facility of npm.
  You will find examples of these in the `templates` folder of this repository.

That's it.

Having a script to do this means that you can install Node-RED anywhere you like. Install two copies, ten if you want.
Have different versions of Node-RED running in parallel. All really easy.

This works on any platform that Node-RED will run on.

## The advamtages

The advantages of this approach I believe are:

- You can have as many different versions of Node-RED installed as you like making it easy to compare behaviours.
- Everything is in one place which makes backup and restore (including a known, working version of Node-RED itself) really simple.
- Everything is in a place that you have chosen. No wasted time hunting for folders in weird places.
- Users don't need admin rights to install an instance of Node-RED.

## Starting Node-RED

When using this method, uou can start Node-RED manually from either the master or the data folder by simply typing:

```bash
> npm start
```

The start script tells Node-RED of the correct userDir folder (the `data` sub-folder). You can also use the
start script with any other method you may wish to use of starting Node-RED (Windows Scheduler, systemd, PM2, nodemon, etc.)

## Updating Node-RED and installed nodes

If you have installed the two `package.json` files in this repository, you will find that they contain `npm run ...`
scripts such as `check-master` and `update-data`. These scripts do everything necessary to see if anything needs
updating (reporting back to the console) and actually doing the updates correctly.

So from either the master or the data folders:

* `npm run check-master` checks the master folder to see if either the `node-red` or `node-red-admin` packages need updating.
* `npm run update-master` reinstalls both `node-red` and `node-red-admin` using the `--unsafe-perm` parameter for Node-RED.
   
   It does a reinstall rather than an update as, in the past, things like the serialport dependencies have failed
   unless you do a full reinstall (mainly after updating NodeJS itself to a new version).
   
* `npm run check-data` and `npm run update-data` check and update any outstanding nodes and other packages you may have installed.

Each of the two package.json files also has a simple `check` and `update` run script that applies to the corresponding folder.

If you lose track of the script names, simply run `npm run` to get a list.

## Changes

Please see the [CHANGELOG](./CHANGELOG.md) file.

## To Do

Please see the [TODO](./TODO.md) file.

## Prerequisites

* NodeJS. v20 is the minimum supported version.

## Sponsorship

If you find value in my work, please consider a small sponsorship or other contribution to help me continue to provide free, open source software.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/A0A3PPMRJ)

[GitHub Sponsorship](https://github.com/sponsors/TotallyInformation), 
[PayPal Sponsorship](https://paypal.me/TotallyInformation),
[Patreon Sponsorship](https://patreon.com/TotallyInformation?utm_medium=github&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink)

## Other links

Here are some other links to my work that you may find interesting:

- ![uib](https://github.com/TotallyInformation/node-red-contrib-uibuilder/raw/main/front-end/images/node-blue.ico) [UIBUILDER for Node-RED](https://github.com/TotallyInformation/node-red-contrib-uibuilder)
  - ❓ [Ideas, questions & general help](https://discourse.nodered.org/tag/node-red-contrib-uibuilder) - Ask your question on the Node-RED forum using the node-red-contrib-uibuilder tag.
  - 📁 [Documentation](https://totallyinformation.github.io/node-red-contrib-uibuilder) - Go to the latest documentation.
  - 🧑‍💻 [Flows](https://flows.nodered.org/search?term=uibuilder) - Example flows, nodes and collections related to UIBUILDER.
  - ℹ️ [WIKI](https://github.com/TotallyInformation/node-red-contrib-uibuilder/wiki) - More documentation and examples.
  - 📂 [Example Svelte External Template](https://github.com/TotallyInformation/uib-template-svelte-simple) - In case you want to build your own svelte app.
  - 📂 [Example Simple External Template](https://github.com/TotallyInformation/uib-template-test) - In case you want to build your own external template.
  - 📊 [uPlot UIBUILDER extension](https://github.com/TotallyInformation/nr-uibuilder-uplot) - Useful charts but also demonstrates how to build your own extension.

- 🧪 [Web Components Library](https://github.com/TotallyInformation/web-components) - A growing library of useful HTML Web Components. Useable with or without Node-RED & UIBUILDER. Some having specific enhancements for Node-RED but will still work well stand-alone. These now have their own dedicated documentation, demo and test website at https://wc.totallyinformation.net. Please check them out there.

- 🔨 [ui library module used by UIBUILDER](https://github.com/TotallyInformation/ui.js) - Can be used stand-alone for turning UI standard config JSON into HTML.

- 🕜 [node-red-contrib-moment](https://github.com/TotallyInformation/node-red-contrib-moment) - Nodes to make use of the MomentJS date/time handling library in Node-RED.

- 🧪 [Testbed for Node-RED custom nodes](https://github.com/TotallyInformation/Node-RED-Testbed) - Embodying more up-to-date thinking than the test nodes, a blank playground.
- 🧪 [Test Nodes for Node-RED](https://github.com/TotallyInformation/uib-template-test) - Some test nodes for Node-RED that help you understand how everything works.

- 🚤 [HotNipi Gauge Web Component](https://github.com/TotallyInformation/gauge-hotnipi) - A really nice looking gauge component. Works with Node-RED, UIBUILDER, or stand-alone.

- 🧪 [Array Grouper](https://github.com/TotallyInformation/groupit) - Stand-alone function to reshape an array of objects.
