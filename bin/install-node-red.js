#!/usr/bin/env node
'use strict'
// @ts-nocheck

/**
 * Install the Node-RED alternate installation template
 *
 * Author: Julian Knight (Totally Information), July 2019
 *
 * License: MIT
 * Copyright (c) 2019-2022 Julian Knight (Totally Information)
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
const replace = require('replace-in-file')

/** Parameters from command line
 * @type {Object} options
 * @property {string} [folder] - Root folder that will contain the Node-RED installation.
 * @property {boolean} [no-color] - Turn off ANSI color output.
 */
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

/** Get start folder (passed as param else requested via command line) */
const folder = path.resolve(options.folder)
const templatesFolder = path.join(__dirname, '..', 'templates')

var msg = chalk`{cyan.bold.underline Alternate Installer for Node-RED}

{white Root Folder . . :} {green.bold.underline ${folder}}
{white Templates Folder:} {green.bold.underline ${templatesFolder}}

`

/** Run npm install (optionally check for NR install)
 * @param {string} pkgFolder The folder in which to run `npm install`.
 * @param {string=} folder The master folder that should contain Node-RED. If present will check if NR successfully installed.
 */
async function installer(pkgFolder, folder='') {
    /** npm commands behave dreadfully. Many will error out even though they actually succeed. */
    console.log({folder})
    try{
        const { stdout, stderr } = await exec('npm install --production --unsafe-perm', {'cwd': folder})
        out.stdout = stdout
        out.stderr = stderr
    } catch(err) {
        //msg += chalk`\n{red CMD ERROR}\n`
        //console.log(err)
        out.stdout = err.stdout
        out.stderr = err.stderr
    } finally {
        if ( folder !== '' ) {
            pkgFolder = tilib.findPackage('node-red', folder)
            if ( pkgFolder !== null ) {
                const nrPkg = tilib.readPackageJson(pkgFolder) || {'version':'N/A'}
                msg += chalk`{green Node-RED v{bold ${nrPkg.version}} successfully installed}\n`
            } else {
                msg += chalk`{red.bold Node-RED failed to install}\n`
            }
        }
    }
}

/** Copy template data folder to data - creates folder if not exists - this is the userDir folder 
 * @param {string} folder The destination root folder
 */
async function copyDataTemplate(pkgFolder, folder) {
    const fldrData = path.join(folder, 'data')
    try {
        await fs.copy(
            path.join(templatesFolder, 'data'),
            fldrData,
            {
                'overwrite': false,
                'errorOnExist': true,
            }
        )
        msg += chalk`{green Copied template data (userDir) folder to ${fldrData}}\n`
    } catch(err) {
        msg += chalk`{red.bold Data (userDir) folder already exists or cannot be created - NOT COPIED - Please use a folder name that does not exist. ${fldrData}}\n`
        return
    }

    const fileReplaceOpts = {
        files: path.join(fldrData, 'envfile.ini'),
        from: /<root-folder-name>/g,
        to: folder,
    }
    try {
        const results = await replace(fileReplaceOpts)
        console.log(`Replaced "<root-folder-name>" with ${folder}`, results)
    } catch (error) {
        console.error(`FAILED to Replace "<root-folder-name>" with ${folder} - change manually before use`, error)
    }
}

/** Copy template master folder to root */
async function copyMasterTemplate(pkgFolder, folder) {
    try {
        await fs.copy(
            path.join(templatesFolder, 'master'),
            folder,
            {
                'overwrite': false,
                'errorOnExist': true,
            }
        )
        msg += chalk`{green Copied template master folder from templates to root folder: ${folder}}\n`
    } catch(err) {
        msg += chalk`{red.bold Root folder already exists or cannot be created - NOT COPIED - Please use a folder name that does not exist. ${folder}}\n`
        return
    }

    const fileReplaceOpts = {
        files: path.join(folder, 'system', 'node-red.service'),
        from: /<root-folder-name>/g,
        to: folder,
    }
    try {
        const results = await replace(fileReplaceOpts)
        console.log(`Replaced "<root-folder-name>" with ${folder}`, results)
    } catch (error) {
        console.error(`FAILED to Replace "<root-folder-name>" with ${folder} - change manually before use`, error)
    }
}

/** If they don't exist, copy ./node_modules/node-red/settings.js to ./data/settings.js */
async function copySettings(pkgFolder, folder) {
    const userDirSettings = path.join(folder, 'data', 'settings.js')

    if ( fs.existsSync(userDirSettings) ) return

    // If userDir/settings.js doesn't exist, copy it

    if (pkgFolder === null) pkgFolder = tilib.findPackage('node-red', folder)
    if ( pkgFolder !== null ) {
        //msg += chalk`{blue \nNode-RED package folder found: ${pkgFolder}\n}`

        try {
            await fs.copy(
                path.join(pkgFolder, 'settings.js'),
                userDirSettings,
                {
                    'overwrite': false,
                    'errorOnExist': true,
                }
            )
            msg += chalk`{green Copied master settings.js}\n`
            msg += 'Check `example-settings.js` if you want an enhanced settings file.\n'
        } catch(err) {
            msg += chalk`{red.bold Master settings.js already exists - NOT COPIED}\n`
        }
    } else {
        msg += chalk`\n{bgRed.bold.yellow  Node-RED package folder not found }\n`
    }

}

/** Coordinate sync/async functions
 * 1) Copy the master template folder to specified root folder
 * 2) Run npm install and copy the data folder (parallel)
 * 3) Copy the custom settings to the data folder
 */
async function main(pkgFolder, folder) {

    await copyMasterTemplate(pkgFolder, folder)

    //These can happen in parallel
    await Promise.all([
        installer(pkgFolder, folder), // install contents of master package.json
        copyDataTemplate(pkgFolder, folder),
    ])

    /** If they don't exist, copy ./node_modules/node-red/settings.js to ./data/settings.js */
    await copySettings(pkgFolder, folder)

    /** Tell the user what happened */
    // @ts-ignore
    console.log( boxen( msg, boxenOptions ) )
}

/** Do it */
main(pkgFolder, folder)
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
