#!/usr/bin/env node
'use strict'

/**
 * Configure the Node-RED alternate installation template
 * according to its actual folder location.
 *
 * Run automatically post-install, see ../package.json
 *
 * Author: Julian Knight (Totally Information), Jan. 2019
 * License: MIT
 */

const fs = require('fs')
const path = require('path')
const version = require('../package.json').version

const templatePath = path.posix.resolve(__dirname, '..')

console.info("\nRunning Post Install Script v%s ...\n", version)

console.info("Template Path is: %s", templatePath)

console.info("\n ... Post Install Script Finished.")
console.log(' ')

process.exit(0)
//EOF
