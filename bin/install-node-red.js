#!/usr/bin/env node
'use strict'
// @ts-nocheck

/**
 * Install the Node-RED alternate installation template
 *
 * Author: Julian Knight (Totally Information), July 2019
 *
 * License: MIT
 * Copyright (c) 2019 Julian Knight (Totally Information)
 * https://it.knightnet.org.uk
 *
 * Process Outline:
 /**  Get start folder (passed as param else requested via command line)
 /**  Create start folder & data sub-folder
 /**  cd start folder
 /**  npm init (better to copy package.json from a template)
 /**  npm install node-red
 /**  copy template data folder to data
 /**  copy ./node_modules/node-red/settings.js to ./data/settings.js
 * -- Job Done! --
 */

const chalk = require('chalk')
const boxen = require('boxen')
const yargs = require('yargs')
const fs = require('fs-extra')
const path = require('path')
//const exec = require('child_process').exec
const util = require('util');
const exec = util.promisify(require('child_process').exec)
const tilib = require('../tilib')
const ora = require('ora') // console spinner

const options = yargs
    .usage('Usage: -f <root-folder-name>')
    .option('f', {
        alias: 'folder', describe: 'Root folder, Node-RED will be installed here', type: 'string', demandOption: true
    })
    .option('no-color', {
        describe: 'Turn off ANSI color output', type: 'boolean', demandOption: false
    })
    .argv

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    //borderColor: 'green',
    //backgroundColor: '#555555'
}

/** Placeholder for the location of the Node-RED package if installed */
const pkgFolder = null
/** Placeholder for npm command output */
const out = {}

const spinner = ora('Installing').start()
spinner.color = 'yellow'

/**  Get start folder (passed as param else requested via command line) */
const folder = path.resolve(options.folder)
const templatesFolder = path.join(__dirname, '..', 'templates')

var msg = chalk`{cyan.bold.underline Alternate Installer for Node-RED}

{white Root Folder . . :} {green.bold.underline ${folder}}
{white Templates Folder:} {green.bold.underline ${templatesFolder}}

`

/**  Create start folder & data sub-folder */
async function ensureFolderExists() {
    const gotDir = await fs.ensureDir(folder)
    if (gotDir) msg += chalk`{green Creating Root Folder: ${gotDir} }\n`
    else msg += chalk`{blue Root folder already exists}\n`
}

/**  npm init (better to copy package.json from a template) */
async function copyMasterPackage() {
    try {
        await fs.copy(
            path.join(templatesFolder, 'master-package.json'),
            path.join(folder, 'package.json'),
            {
                'overwrite': false,
                'errorOnExist': true,
            }
        )
        msg += chalk`{green Copied template master package.json}\n`
    } catch(err) {
        msg += chalk`{red.bold Master package.json already exists - NOT COPIED}\n`
    }
}

/**  npm install node-red */
async function installNodeRed(pkgFolder) {
    /** npm commands behave dreadfully. Many will error out even though they actually succeed. */
    try{
        const { stdout, stderr } = await exec('npm run update-master', {'cwd': folder})
        out.stdout = stdout
        out.stderr = stderr
    } catch(err) {
        //msg += chalk`\n{red CMD ERROR}\n`
        //console.log(err)
        out.stdout = err.stdout
        out.stderr = err.stderr
    } finally {
        pkgFolder = tilib.findPackage('node-red', folder)
        if ( pkgFolder !== null ) {
            const nrPkg = tilib.readPackageJson(pkgFolder) || {'version':'N/A'}
            msg += chalk`{green Node-RED v{bold ${nrPkg.version}} successfully installed}\n`
        } else {
            msg += chalk`{red.bold Node-RED failed to install}\n`
        }
    }
}

/**  copy template data folder to data */
async function copyDataTemplate() {
    try {
        await fs.copy(
            path.join(templatesFolder, 'data'),
            path.join(folder, 'data'),
            {
                'overwrite': false,
                'errorOnExist': true,
            }
        )
        msg += chalk`{green Copied data folder from templates}\n`
    } catch(err) {
        msg += chalk`{red.bold Data folder already exists - NOT COPIED}\n`
    }
}

/**  copy template system folder to root */
async function copySystemTemplate() {
    try {
        await fs.copy(
            path.join(templatesFolder, 'system'),
            path.join(folder, 'system'),
            {
                'overwrite': false,
                'errorOnExist': true,
            }
        )
        msg += chalk`{green Copied system folder from templates to root folder}\n`
    } catch(err) {
        msg += chalk`{red.bold System folder already exists in root - NOT COPIED}\n`
    }
}

/**  copy ./node_modules/node-red/settings.js to ./data/settings.js */
async function copySettings(pkgFolder) {
    if (pkgFolder === null) pkgFolder = tilib.findPackage('node-red', folder)
    if ( pkgFolder !== null ) {
        //msg += chalk`{blue \nNode-RED package folder found: ${pkgFolder}\n}`

        try {
            await fs.copy(
                path.join(pkgFolder, 'settings.js'),
                path.join(folder, 'data', 'settings.js'),
                {
                    'overwrite': false,
                    'errorOnExist': true,
                }
            )
            msg += chalk`{green Copied master settings.js}\n`
        } catch(err) {
            msg += chalk`{red.bold Master settings.js already exists - NOT COPIED}\n`
        }
    } else {
        msg += chalk`\n{bgRed.bold.yellow  Node-RED package folder not found }\n`
    }

}

async function main() {
    await ensureFolderExists()

    await copyMasterPackage()

    //These can happen in parallel
    await Promise.all([
        installNodeRed(),
        copyDataTemplate(),
        copySystemTemplate(),
    ])

    /**  copy ./node_modules/node-red/settings.js to ./data/settings.js */
    await copySettings(pkgFolder)

    /** Tell the user what happened */
    const msgBox = boxen( msg, boxenOptions )
    console.log(msgBox)
}

main()
.then( () => {
    spinner.stop()

    console.log(chalk`{cyan.bold NPM COMMAND OUTPUT}`)
    console.log(out.stdout)
    console.log(chalk`{magenta.bold NPM COMMAND ERROR OUTPUT}`)
    console.log(out.stderr)
})
.catch( (err) => { // belt & braces
    console.error(err)
})

//EOF
