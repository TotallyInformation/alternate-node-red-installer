#!/usr/bin/env node
'use strict'

/**
 * Install the Node-RED alternate installation template
 *
 * Author: Julian Knight (Totally Information), Jan. 2019
 * License: MIT
 */

const fs = require('fs')
const https = require('https')
const path = require('path')
const os = require('os')
const child_process = require('child_process')
const readline = require('readline')

function download(url, dest, cb) {
    const file = fs.createWriteStream(dest);
    const request = https.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(cb);  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
    });
};

console.warn("\nSorry, no installer available yet,")
console.warn("  Please see the README.md file for manual installation.\n")

// Download latest archive from GitHub to temp folder
// https://github.com/TotallyInformation/alternate-node-red-installer/archive/master.zip
const dest  = './alternate-node-red-installer.zip'
const url = 'https://codeload.github.com/TotallyInformation/alternate-node-red-installer/archive/master.zip'
download(url, dest, function(){
    console.log('done?')
})
// Unpack
// Ask for parent folder & master folder name
// Copy template folder to master folder
// cd masterFolder, Run `npm run update`
// Delete temp files/folders
