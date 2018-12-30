# alternate-node-red-installer
An alternative installer for Node-RED. Avoids global installs, no admin rights required.

**WARNING**: THIS IS JUST SOME NOTES RIGHT NOW. By all means use them to do your own custom install of Node-RED.
The scripts will be along as soon as I can make them. The `templates` folder shows you the folder structure and
the two `package.json` files that you need.

> This solution is particularly suited for development environments and anywhere that you don't want to install global NodeJS scripts. Also when you need to have different versions of Node-RED running in parallel

## Introduction

Node-RED is a superb, flow-based development and prototyping tool written by IBM to showcase their IoT experience.
It was later gifted to the JavaScript Foundation. It is entirely JavaScript based thanks to NodeJS and a number
of other great libraries such as D3 and JQuery.

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
* Use the `npm` package manager to install node-red (and node-red-admin if you like) into that folder. `npm install --unsafe-perm node-red node-red-admin`
* Create a sub-folder as your `userDir` - the place all
of the nodes and your flows and other information is put.
* Create startup and update scripts both for the master folder
and the userDir folder using the script facility of npm. You will find examples of these in the `templates` folder of this repository.

That's it.

Having a script to do this means that you can install Node-RED anywhere you like. Install two copies, ten if you want.
Have different versions of Node-RED running in parallel. All really easy.

This works on any platform that Node-RED will run on.

## Installing

1. Make sure that you have Node.JS correctly installed. Check that you can run it manually from the command line with `node --version && npm --version`.
2. Copy the [template](./template/) folder and the [`.template/data`](data/) subfolder to any convenient location on the device where you want Node-RED to run. You should probably give the resulting folder a more meaningful name than `template`. The contents of that folder will become the master project folder for Node-RED.
3. From a command line, navigate to the folder created in step 2 and run `npm run update`. This will install Node-RED and the admin tool.
4. Run Node-RED manually by issuing the command `npm start`. You will see the Node-RED log output in the terminal and it should start correctly.

These instructions should work on any platform supported by Node.JS.


## Starting Node-RED

When using this method, uou can start Node-RED manually from either the master or the data folder by simply typing:

```bash
> npm start
```

The start script tells Node-RED of the correct userDir folder (the `data` sub-folder). You can also use the
start script with any other method you may wish to use of starting Node-RED (Windows Scheduler, systemd, PM2, nodemon, etc.)

## Updating

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

## Prerequisites

* NodeJS. v4 may be enough but really v8 or above is more sensible.

## Installation

```
> cd <parent-folder>
parent-folder>
```
