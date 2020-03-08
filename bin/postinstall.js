#!/usr/bin/env node
// This file runs after alternate-node-red-installer has been installed using npm //
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

/** DONT WANT TO PROCESS THIS FOR NOW - NOT READY */
if (true === false) {

const fs = require('fs')
const path = require('path')
const os = require('os')
const child_process = require('child_process')
const readline = require('readline')

/** Start everything up */
function start() {
    console.info("\n%sRunning Post Install Script %sv%s%s ...%s\n", c.FgCyan, c.FgMagenta, version, c.FgCyan, c.Reset)

    console.info("%sTemplate Path is:%s %s%s", c.FgCyan, c.FgMagenta, templatePath, c.Reset)
}

/** Finish everything off and exit */
function finish() {
    console.log(`\n${c.FgBlack + c.BgGreen} You can now use the ${c.FgMagenta}npm run${c.FgBlack} scripts to control things. ${c.Reset}`)
    let cwd = process.cwd()
    process.chdir(templatePath)
    child_process.execSync('npm run', {stdio: 'inherit'})
    process.chdir(cwd)
    console.log(`${c.FgBlack + c.BgGreen} See README.md for details. ${c.Reset}`)

    console.info("\n%s... Post Install Script Finished.%s\n", c.FgMagenta, c.Reset)

    process.exit(0)
}

const version = '' //require('../package').version
const validEngines = '' // require('../package').engines

const templatePath = path.posix.resolve(__dirname, '..')

// ANSI 3/4bit Console colours, @see https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
const c = {
    "Reset": "\x1b[0m",
    "Bright": "\x1b[1m",
    "Dim": "\x1b[2m",
    "Underscore": "\x1b[4m",
    "Blink": "\x1b[5m",
    "Reverse": "\x1b[7m",
    "Hidden": "\x1b[8m",

    // Add 1; to get bright versions, e.g. Bright Red [1;31m
    // or use Fg 90-97, Bg 100-107

    "FgBlack": "\x1b[30m",
    "FgRed": "\x1b[31m",
    "FgGreen": "\x1b[32m",
    "FgYellow": "\x1b[33m",
    "FgBlue": "\x1b[34m",
    "FgMagenta": "\x1b[35m",
    "FgCyan": "\x1b[36m",
    "FgWhite": "\x1b[37m",
    "FgBrMagenta": "\x1b[1;35m",

    "BgBlack": "\x1b[40m",
    "BgRed": "\x1b[41m",
    "BgGreen": "\x1b[42m",
    "BgYellow": "\x1b[43m",
    "BgBlue": "\x1b[44m",
    "BgMagenta": "\x1b[45m",
    "BgCyan": "\x1b[46m",
    "BgWhite": "\x1b[47m",
}

start()

// If running on Linux
if ( os.platform() !== 'linux' ) {

    // Create I/F for reading input from console
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    const handleQuestionError = (err) => {
        console.error(`ERROR: ${err}`)
        process.exit(1)
    }

    const askQuestions = (questions) => {
        return new Promise( (res, rej) => {
            if(typeof questions === 'undefined') rej(`No questions provided`)
            if(typeof questions === 'string') questions = [questions]
            if ( ! Array.isArray(questions) ) rej(`Questions variable must be a string or an array of strings`)

            let chainQ = Promise.resolve([]); // resolve to active 'then' chaining (empty array for answers)

            questions.forEach(question => {
                chainQ = chainQ.then( answers => new Promise( (resQ, rejQ) => {
                        rl.question(`${question}: `, answer => {
                            // Trim and limit answer to 150 characters
                            answers.push( answer.trim().substring(0,150) )
                            resQ(answers)
                        })
                    })
                )
            })

            chainQ.then((answers) => {
                rl.close()
                res(answers)
            })
        });
    };

    const processAnswers = (answers) => {
        return new Promise( (res, rej) => {

            // default answers
            if ( answers[0] === '' ) answers[0] = 'node-red'

            console.log('OUTPUT:')
            console.dir(answers)

            // Change ./system/node-red.service
            // Ensure service file has correct permissions
            // Ensure user running this command has correct (admin) permissions
            // Link service file to /etc/systemd/system/multi-user.target.wants/

            finish()
        })
    }

    // Get input from user
    const QUESTIONS = [
        'What name do you want to give the systemd service that will run this instance of Node-RED? [node-red] ',
    ]

    askQuestions(QUESTIONS)
    .then(processAnswers)
    .catch(handleQuestionError)

    // NOTE: Remember that processing will reach here immediately, it
    //       doesn't wait for the questions and answer processing.
    //       so the processAnswers function contains the finish() fn.

} else {
    // If not running on Linux, print msg and exit
    console.log("\nYou are running on platform `%s`", os.platform())
    console.log("there is no configuration we can do on this platform.")

    console.log("\nYou will need to configure any auto startup yourself.")

    finish()
}

//EOF
}
