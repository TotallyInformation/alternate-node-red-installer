// @ts-nocheck
/**
 * An ENHANCED version of the default settings file provided by Node-RED by Totally Information (Julian Knight).
 *
 * see ../node_modules/node-red/settings.js
 * Updated for Node-RED version v4.1.8
 * To review changes: https://github.com/node-red/node-red/commits/master/packages/node_modules/node-red/settings.js
 *
 * It can contain any valid JavaScript code that will get run when Node-RED is started.
 *
 * For more information about individual settings, refer to the documentation:
 *    https://nodered.org/docs/user-guide/runtime/configuration
 *
 * The settings are split into the following sections:
 *  - Flow File and User Directory Settings
 *  - Security
 *  - Server Settings
 *  - Runtime Settings
 *  - Editor Settings
 *  - Node Settings
 **/
'use strict'

const path = require('node:path')   // Node core library. path library for cross-platform file system specs
const fs = require('node:fs')     // The `https` setting requires the `fs` module.
const os = require('node:os')

// #region ---- Output some initial process data to log on startup ----
/** Save a PID file so that Node-RED can be easily restarted even when run manually */
const pid = process.pid
process.env.node_red_pid = pid + ''
fs.readdir('.', (err, files) => {
    if (err) throw err

    for (let i = 0, len = files.length; i < len; i++) {
        const match = files[i].match(/.*\.pid/)
        if (match !== null) { fs.unlink(match[0], (err) => {
            if (err) throw err
        }) }
    }

    fs.writeFile(`${pid}.pid`, `${pid}`, (err) => {
        if (err) throw err
    })
})
/** Optionally display the Node.js/v8 engine heap size on startup */
const v8 = require('v8')
const mem = process.memoryUsage()
const formatMem = (m) => ( m / 1048576 ).toFixed(2)
/** Show info about the process */
console.info(' ')
console.group('Process Data')
console.info('PID: ', pid)
console.group('Memory')
console.info(`V8 Total Heap Size: ${(v8.getHeapStatistics().total_available_size / 1024 / 1024).toFixed(2)} MB`)
console.info(`Initial Memory Use (MB): RSS=${formatMem(mem.rss)}. Heap: Used=${formatMem(mem.heapUsed)}, Tot=${formatMem(mem.heapTotal)}. Ext C++=${formatMem(mem.external)}`)
console.groupEnd()
if (typeof module !== 'undefined') { // Running as a CommonJS module
    console.info('Node-RED runtime location: ', require.main.path)
    // console.info('Node.js require paths: ', require.main.paths)
} // else { // Running as an ESM - can't even have this in the code if not running as an ESM!
//     console.log('Node-RED runtime location: ', fileURLToPath(import.meta.url))
// }
console.info('Node.js location: ', process.argv[0])
console.info('Node-RED current working directory: ', process.cwd())
console.groupEnd()
console.info(' ')
//#endregion ---- -------- ----

/** Set logging levels
 * Options: off + trace + debug + info + warn + error + fatal
 */
const logLevel = 'info'
const showMetrics = false
const showAudit = false

/** Calculate relative path from CWD to settings.js location */
const settingsRelPath = path.relative(process.cwd(), __dirname)

// All of the standard settings - with added folding regions and some additional comments for ease of use
const nrsettings = {

    //#region ----- Flow File and User Directory Settings ----- //
    /** *****************************************************************************
     * Flow File and User Directory Settings
     *  - flowFile
     *  - credentialSecret
     *  - flowFilePretty
     *  - userDir
     *  - nodesDir
     ******************************************************************************/

    /** The file containing the flows. If not set, it defaults to flows_<hostname>.json. */
    flowFile: 'flows.json',

    /** By default, credentials are encrypted in storage using a generated key. To
     * specify your own secret, set the following property.
     * If you want to disable encryption of credentials, set this property to false.
     * Note: once you set this property, do not change it - doing so will prevent
     * node-red from being able to decrypt your existing credentials and they will be
     * lost.
     */
    credentialSecret: 'a-secret-key',

    /** By default, the flow JSON will be formatted over multiple lines making
     * it easier to compare changes when using version control.
     * To disable pretty-printing of the JSON set the following property to false.
     */
    flowFilePretty: true,

    /** By default, all user data is stored in a directory called `.node-red` under
     * the user's home directory. To use a different location, the following
     * property can be used
     * More commonly, this is set via the startup command
     */
    // userDir: path.join(os.homedir(), '.node-red')',

    /** Node-RED scans the `nodes` directory in the userDir to find local node files.
     * The following property can be used to specify an additional directory to scan.
     */
    // nodesDir: path.join(os.homedir(), '.node-red', 'nodes')',

    //#endregion ----- Flow File and User Directory Settings ----- //

    //#region ----- Security Settings ----- //

    /** *****************************************************************************
     * Security
     *  - adminAuth
     *  - https
     *  - httpsRefreshInterval
     *  - requireHttps
     *  - httpNodeAuth
     *  - httpStaticAuth
     ******************************************************************************/

    /** To password protect the Node-RED editor and admin API, the following
     * property can be used. See http://nodered.org/docs/security.html for details.
     */
    /* adminAuth: {
        type: 'credentials',
        // sessionExpiryTime: 604800, // in secs, default 7d=604800
        default: {
            permissions: '*', //['fred'],
        },
        users: [
            {
                username: 'admin',
                password: '$2a$08$XPzmmEYTvmUI75ajrc.mheyvRKSoZAUwQYDgdmlYLUp3eP6JQrz1m', //pw
                permissions: '*',
            },
        ]
    }, */

    /** The following property can be used to enable HTTPS
     * This property can be either an object, containing both a (private) key
     * and a (public) certificate, or a function that returns such an object.
     * See http://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
     * for details of its contents.
     */
    /** Option 1: static object */
    /* https: {
        key: fs.readFileSync( path.join(os.homedir(), '.acme', 'LocalHTTPSDevCertificate.key') ),
        cert: fs.readFileSync( path.join(os.homedir(), '.acme', 'LocalHTTPSDevCertificate.crt') )
    }, */
    /** Option 2: function that returns the HTTP configuration object */
    /*  https: function() {
            return {
                key: fs.readFileSync('privkey.pem'),
                cert: fs.readFileSync('cert.pem'),
            }
        },
        OR https asynchronous function:
        https: function() {
            return Promise.resolve({
                key: fs.readFileSync('privkey.pem'),
                cert: fs.readFileSync('cert.pem'),
            })
        },
    */

    /** If the `https` setting is a function, the following setting can be used
     * to set how often, in hours, the function will be called. That can be used
     * to refresh any certificates.
     */
    // httpsRefreshInterval : 12,

    /** The following property can be used to cause insecure HTTP connections to
     * be redirected to HTTPS.
     */
    // requireHttps: true,

    /** To password protect the node-defined HTTP endpoints (httpNodeRoot),
     * including node-red-dashboard, or the static content (httpStatic), the
     * following properties can be used.
     * The `pass` field is a bcrypt hash of the password.
     * See http://nodered.org/docs/security.html#generating-the-password-hash
     */
    // httpNodeAuth: {user:'user',pass:'$2a$08$XPzmmEYTvmUI75ajrc.mheyvRKSoZAUwQYDgdmlYLUp3eP6JQrz1m'}, //pass="pw"
    // httpStaticAuth: {user:'user',pass:'$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN.'},

    //#endregion ----- Security Settings ----- //

    //#region ----- Server Settings ----- //

    /** *****************************************************************************
     * Server Settings
     *  - uiPort
     *  - uiHost
     *  - apiMaxLength
     *  - httpServerOptions
     *  - httpAdminRoot
     *  - httpAdminMiddleware
     *  - httpAdminCookieOptions
     *  - httpNodeRoot
     *  - httpNodeCors
     *  - httpNodeMiddleware
     *  - httpStatic
     *  - httpStaticRoot
     *  - httpStaticCors
     *  - proxyOptions
     ******************************************************************************/

    /** The tcp port that the Node-RED web server is listening on */
    uiPort: process.env.PORT || 1880,

    /** By default, the Node-RED UI accepts connections on all IPv4 interfaces.
     * To listen on all IPv6 addresses, set uiHost to "::",
     * The following property can be used to listen on a specific interface. For
     * example, the following would only allow connections from the local machine.
     * This can be useful security when putting NR behind a reverse proxy on the same device.
     */
    // uiHost: process.env.HOST || '127.0.0.1',

    /** The maximum size of HTTP request that will be accepted by the runtime api. Default: 5mb */
    // apiMaxLength: '5mb',

    /** The following property can be used to pass custom options to the Express.js
     * server used by Node-RED. For a full list of available options, refer
     * to http://expressjs.com/en/api.html#app.settings.table
     */
    httpServerOptions: {
        // http://expressjs.com/en/api.html#trust.proxy.options.table
        'trust proxy': '127.0.0.1/8, ::1/128', // true,  // true/false; or subnet(s) to trust; or custom function returning true/false. default=false
        'x-powered-by': false,
    },

    /** By default, the Node-RED UI is available at http://localhost:1880/
     * The following property can be used to specify a different root path.
     * If set to false, this is disabled.
     *  WARNING: If left unset or set to a path that user paths sit beneath,
     *           any admin middleware such as the httpAdminMiddleware function
     *           will also run for those user paths.
     *           This can have unintended consequences.
     */
    httpAdminRoot: process.env.httpAdminRoot || '/admin',

    /** The following property can be used to add a custom middleware function
     *  in front of all admin http routes. For example, to set custom http headers.
     *  It can be a single function or an array of middleware functions.
     *
     * @param {import("express").Request} req The ExpressJS request object
     * @param {import("express").Response} res The ExpressJS result object
     * @param {import("express").NextFunction} next Function that MUST be called at the end of this function so that further ExpressJS middleware functions will be chained
     */
    httpAdminMiddleware: function(req, res, next) {
        // Set the X-Frame-Options header to limit where the editor can be embedded
        res.set('X-Frame-Options', 'sameorigin')
        res.setHeader('x-environment2', 'Dev Admin')
        // console.log('ADMIN HEADERS', req.headers)
        next()
    },

    /** The following property can be used to set addition options on the session
     * cookie used as part of adminAuth authentication system
     * Available options are documented here: https://www.npmjs.com/package/express-session#cookie
     */
    // httpAdminCookieOptions: { },

    /** Some nodes, such as HTTP In, can be used to listen for incoming http requests.
     * By default, these are served relative to '/'. The following property
     * can be used to specify a different root path. If set to false, this is
     * disabled.
     * NOTE: Node-RED's httpStatic setting IGNORE's this property
     */
    httpNodeRoot: process.env.httpNodeRoot || false, // '/nr',

    /** The following property can be used to configure cross-origin resource sharing
     * in the HTTP nodes.
     * See https://github.com/troygoode/node-cors#configuration-options for
     * details on its contents. The following is a basic permissive set of options:
     */
    // httpNodeCors: {
    //     origin: "*",
    //     methods: "GET,PUT,POST,DELETE"
    // },

    /** If you need to set an http proxy to reach out, please set an environment variable
     * called http_proxy (or HTTP_PROXY) outside of Node-RED in the operating system.
     * For example - http_proxy=http://myproxy.com:8080
     * (Setting it here will have no effect)
     * You may also specify no_proxy (or NO_PROXY) to supply a comma separated
     * list of domains to not proxy, eg - no_proxy=.acme.co,.acme.co.uk
     */

    /** The following property can be used to add a custom middleware function
     *  in front of all http in nodes. This allows custom authentication to be
     *  applied to all http in nodes, or any other sort of common request processing.
     *  It can be a single function or an array of middleware functions.
     *
     * @param {import("express").Request} req The ExpressJS request object
     * @param {import("express").Response} res The ExpressJS response object
     * @param {import("express").NextFunction} next Function that MUST be called at the end of this function so that further ExpressJS middleware functions will be chained
     */
    httpNodeMiddleware: function(req, res, next) {
        // Handle/reject the request, or pass it on to the http in node by calling next();
        // Optionally skip our rawBodyParser by setting this to true;
        // req.skipRawBodyParser = true;

        // Help reduce risk of XSS and other attacks
        res.setHeader('X-XSS-Protection', '1;mode=block')
        res.setHeader('X-Content-Type-Options', 'nosniff')
        // res.setHeader('X-Frame-Options','SAMEORIGIN')
        // res.setHeader('Content-Security-Policy',"script-src 'self'")

        // console.log('USER HEADERS', req.headers)

        next()
    },

    /** When httpAdminRoot is used to move the UI to a different root path, the
     *  following property can be used to identify a directory of static content
     *  that should be served at http://localhost:1880/.
     * When httpStaticRoot is set differently to httpAdminRoot, there is no need
     * to move httpAdminRoot.
     */
    httpStatic: process.env.httpStatic || path.join(settingsRelPath, 'public'), //single static source
    /** OR multiple static sources can be created using an array of objects...
     * Each object can also contain an options object for further configuration.
     * See https://expressjs.com/en/api.html#express.static for available options.
     * They can also contain an option `cors` object to set specific Cross-Origin
     * Resource Sharing rules for the source. `httpStaticCors` can be used to
     * set a default cors policy across all static routes.
     */
    // httpStatic: [
    //    {path: path.join('.', 'pics'),    root: "/img/"},
    //    {path: path.join('.', 'reports'), root: "/doc/"},
    // ],

    /** All static routes will be appended to httpStaticRoot
     * e.g. if httpStatic = "/home/nol/docs" and  httpStaticRoot = "/static/"
     *      then "/home/nol/docs" will be served at "/static/"
     * e.g. if httpStatic = [{path: '/home/nol/pics/', root: "/img/"}]
     *      and httpStaticRoot = "/static/"
     *      then "/home/nol/pics/" will be served at "/static/img/"
     */
    // httpStaticRoot: '/static/',

    /** The following property can be used to configure cross-origin resource sharing
     * in the http static routes.
     * See https://github.com/troygoode/node-cors#configuration-options for
     * details on its contents. The following is a basic permissive set of options:
     */
    //httpStaticCors: {
    //    origin: "*",
    //    methods: "GET,PUT,POST,DELETE"
    //},

    /** The following property can be used to modify proxy options */
    // proxyOptions: {
    //     mode: "legacy", // legacy mode is for non-strict previous proxy determination logic (node-red < v4 compatible)
    // },

    //#endregion ----- Server Settings ----- //

    //#region ----- Runtime Settings ----- //
    /** *****************************************************************************
     * Runtime Settings
     *  - lang
     *  - runtimeState
     *  - telemetry
     *  - diagnostics
     *  - logging
     *  - contextStorage
     *  - exportGlobalContextKeys
     *  - externalModules
     ******************************************************************************/

    /** Uncomment the following to run node-red in your preferred language.
     * Available languages include: en-US (default), ja, de, zh-CN, zh-TW, ru, ko
     * Some languages are more complete than others.
     */
    // lang: "de",

    /** Configure diagnostics options
     * - enabled:  When `enabled` is `true` (or unset), diagnostics data will
     *   be available at http://localhost:1880/diagnostics
     *   NB: If httpAdminRoot is set, adjust the above accordingly
     * - ui: When `ui` is `true` (or unset), the action `show-system-info` will
     *   be available to logged in users of node-red editor
     */
    diagnostics: {
        /** enable or disable diagnostics endpoint. Must be set to `false` to disable */
        enabled: true,
        /** enable or disable diagnostics display in the node-red editor. Must be set to `false` to disable */
        ui: true,
    },

    /** Configure runtimeState options
     * - enabled:  When `enabled` is `true` flows runtime can be Started/Stopped
     *   by POSTing to available at http://localhost:1880/flows/state
     *   NB: If httpAdminRoot is set, adjust the above accordingly
     * - ui: When `ui` is `true`, the action `core:start-flows` and
     *   `core:stop-flows` will be available to logged in users of node-red editor
     *   Also, the deploy menu (when set to default) will show a stop or start button
     */
    runtimeState: {
        /** enable or disable flows/state endpoint. Must be set to `false` to disable */
        enabled: false,
        /** show or hide runtime stop/start options in the node-red editor. Must be set to `false` to hide */
        ui: false,
    },

    /** By default, telemetry is disabled until the user provides consent the first
     * time they open the editor. If accepted, it is then set to true.
     * 
     * The following property can be uncommented and set to true/false to enable/disable
     * telemetry without seeking further consent in the editor.
     * The user can override this setting via the user settings dialog within the editor
     */
    telemetry: {
        // enabled: true,
        /**
         * If telemetry is enabled, the editor will notify the user if a new version of Node-RED
         * is available. Set the following property to false to disable this notification.
         */
        // updateNotification: true
    },

    /** Configure the logging output */
    logging: {
        console: {
            /** Level of logging to be recorded. Options are:
             * fatal - only those errors which make the application unusable should be recorded
             * error - record errors which are deemed fatal for a particular request + fatal errors
             * warn - record problems which are non fatal + errors + fatal errors
             * info - record information about the general running of the application + warn + error + fatal errors
             * debug - record information which is more verbose than info + info + warn + error + fatal errors
             * trace - record very detailed logging + debug + info + warn + error + fatal errors
             * off - turn off all logging (doesn't affect metrics or audit)
             */
            level: logLevel,
            /** Whether or not to include metric events in the log output */
            metrics: showMetrics,
            /** Whether or not to include audit events in the log output */
            audit: showAudit,
        },
        /** Custom logging: https://nodered.org/docs/user-guide/runtime/logging */
        // An example output to a file but using color-coding with chalk.
        // Make sure you install the dependencies first.
        // tilog: {
        //     level: 'trace',
        //     metrics: false,
        //     audit: false,
        //     handler: function(settings) {
        //         // Called when the logger is initialised
        //         const fs = require('node:fs')
        //         const util = require('node:util')
        //         const Chalk = require('chalk')
        //         // const chalkTemplate = require('chalk-template')
        //         const chalk = new Chalk.Instance({level: 3})
        //         // Use flags 'a' to append or 'w' to create new on restart
        //         const log_file = fs.createWriteStream(__dirname + '/uibuilder.log', {flags : 'w'})

        //         const tilogLevels = {
        //             10: 'FATAL', 20: 'ERROR', 30: 'WARN ', 40: 'INFO ', 50: 'DEBUG', 60: 'TRACE', 98: 'AUDIT', 99: 'MTRIC'
        //         }

        //         const tilog = function(d) { //
        //             log_file.write(util.format.apply(null, arguments) + '\n')
        //             //log_stdout.write(util.format(d) + '\n');
        //         }

        //         /** Return the logging function
        //          * msg schema: { id, level, type, msg, timestamp}
        //          * id = The node instance that produces the msg
        //          * level = 10: fatal, 20: error, 30: warn, 40: Info, 50: Debug, 60: Trace
        //          * timestamp = Javascript timestamp. Use `(new Date(msg.timestamp)).toIsoString()` or similar to convert
        //          * type = 'flow' - not clear when/why this is produced
        //          */
        //         return function(msg) {
        //             if ( msg.level < 51 || msg.msg.includes('[uibuilder') || msg.msg.startsWith('+-') || msg.msg.startsWith('| ') || msg.msg.startsWith('>>') ) {
        //                 //console.log('TOLOG: ', msg)
        //                 if (msg.msg.includes('[uibuilder:')) msg.msg = msg.msg.replace('[uibuilder:', '[')
        //                 let msgColor, introColor
        //                 switch (msg.level) {
        //                     case 10: { // fatal
        //                         msgColor = chalk.redBright
        //                         introColor = msgColor.bold.inverse
        //                         break
        //                     }

        //                     case 20: { // error
        //                         msgColor = chalk.red
        //                         introColor = msgColor.inverse
        //                         break
        //                     }

        //                     case 30: { // warn
        //                         msgColor = chalk.rgb(255, 185, 0)
        //                         introColor = msgColor.inverse
        //                         break
        //                     }

        //                     case 40: { // info
        //                         msgColor = chalk.yellow
        //                         introColor = msgColor.inverse
        //                         break
        //                     }

        //                     case 50: { // debug
        //                         msgColor = chalk.greenBright
        //                         introColor = msgColor.inverse
        //                         break
        //                     }

        //                     case 60: { // trace
        //                         msgColor = chalk.cyanBright
        //                         introColor = msgColor.inverse
        //                         break
        //                     }

        //                     default: {
        //                         msgColor = chalk.reset
        //                         introColor = msgColor.inverse
        //                         break
        //                     }
        //                 }
        //                 let intro = introColor(tilogLevels[msg.level]+'|')
        //                 tilog( intro, msgColor(msg.msg) )
        //             }
        //             // else {
        //             //     tilog(
        //             //         `?? ${tilogLevels[msg.level]}:`, msg.msg
        //             //     )
        //             // }
        //         }
        //     }
        // },
        /** Example winston logging */
        // winstonLog: {
        //     level: 'trace',
        //     metrics: false,
        //     audit: false,
        //     handler: function(settings) {
        //         // const winstond = require('winstond')

        //         // const server = winstond.nssocket.createServer({
        //         //     services: ['collect', 'query', 'stream'],
        //         //     port: 9003
        //         // });

        //         // server.add(winstond.transports.File, {
        //         //     filename: __dirname + '/foo.log'
        //         // })

        //         // server.listen()

        //         // const winston = require('winston')
        //         // require('winston-mqtt').MqttTransport

        //         const myCustomLevels = {
        //             levels: {
        //                 'FATAL':10,
        //                 'ERROR':20,
        //                 'WARN ':30,
        //                 'INFO ':40,
        //                 'DEBUG':50,
        //                 'TRACE':60,
        //                 'AUDIT':98,
        //                 'MTRIC':99
        //             },
        //             colors: {
        //                 'FATAL':'redBG',
        //                 'ERROR':'red',
        //                 'WARN ':'orange',
        //                 'INFO ':'yellow',
        //                 'DEBUG':'green',
        //                 'TRACE':'cyan',
        //                 'AUDIT':'grey',
        //                 'MTRIC':'grey'
        //             }
        //         }

        //         // winston.add(require('winston-nssocket').Nssocket, {
        //         //     host: 'localhost',
        //         //     port: 9003
        //         // })

        //         // const { combine, timestamp, label, printf, splat, prettyPrint, colorize } = winston.format

        //         // const myFormat = printf(({ level, message, label, timestamp }) => {
        //         //     //return `${timestamp} ${level}| [${label}] ${message}`
        //         //     return `${level}| ${message.replace('[uibuilder:','[')}`
        //         // })

        //         // var mylog = winston.createLogger({
        //         //     levels: myCustomLevels.levels, //winston.config.npm.levels, //
        //         //     level: 'TRACE',
        //         //     transports: [
        //         //         //new winston.transports.Console({ format: winston.format.simple() }),
        //         //         new winston.transports.File({ filename: 'uibuilder1.log' }),
        //         //         new winston.transports.Http({ // https://github.com/winstonjs/winston/blob/HEAD/docs/transports.md#http-transport
        //         //             host: 'localhost',
        //         //             port: 1880,
        //         //             path: '/nr/winston',
        //         //             // auth, ssl
        //         //         }),
        //         //         new winston.transports.MqttTransport, {
        //         //             name: 'node-red',
        //         //             topic: 'log',
        //         //             host: 'mqtt://localhost:1883',
        //         //             // requestTracer: {
        //         //             //   instance: myRequestObject,
        //         //             //   property: 'requestId'
        //         //             // }
        //         //          }
        //         //     ],
        //         //     // https://github.com/winstonjs/logform#readme
        //         //     format: combine(
        //         //         //label({ label: 'right meow!' }),
        //         //         //timestamp(),
        //         //         colorize({ colors: myCustomLevels.colors, all:true }),
        //         //         prettyPrint(),
        //         //         myFormat
        //         //     ),
        //         // })

        //         // mylog.log({
        //         //     'level': 'TRACE',
        //         //     'message': 'Hello'
        //         // })

        //         // winston.stream().on('log', function (log) {
        //         //     console.log(log);
        //         // });

        //         // winston.query({ start: 10 }, function (err, results) {
        //         //     if (err) throw err;
        //         //     console.log(results);
        //         // });

        //         const nrLogLevels = {
        //             10: 'FATAL', 20: 'ERROR', 30: 'WARN ', 40: 'INFO ', 50: 'DEBUG', 60: 'TRACE', 98: 'AUDIT', 99: 'MTRIC'
        //         }

        //         // return function(msg) {
        //         //     if ( msg.level < 51 || msg.msg.includes('[uibuilder') || msg.msg.startsWith('+-') || msg.msg.startsWith('| ') || msg.msg.startsWith('>>') ) {
        //         //         mylog.log({
        //         //             'level': nrLogLevels[msg.level],
        //         //             'message': msg.msg
        //         //         })
        //         //     }
        //         // }
        //     }
        // },

        /** Output log data to a single topic on MQTT - this can then be consumed in Node-RED itself */
        /*
        mqttLog: {
            level: 'trace',
            metrics: false,
            audit: false,
            handler: function(settings) {
                const nrLogLevels = { // eslint-disable-line no-unused-vars
                    10: 'FATAL', 20: 'ERROR', 30: 'WARN ', 40: 'INFO ', 50: 'DEBUG', 60: 'TRACE', 98: 'AUDIT', 99: 'MTRIC'
                }
                const myCustomLevels = { // eslint-disable-line no-unused-vars
                    levels: {
                        'FATAL': 10,
                        'ERROR': 20,
                        'WARN ': 30,
                        'INFO ': 40,
                        'DEBUG': 50,
                        'TRACE': 60,
                        'AUDIT': 98,
                        'MTRIC': 99
                    },
                    colors: {
                        'FATAL': 'redBG',
                        'ERROR': 'red',
                        'WARN ': 'orange',
                        'INFO ': 'yellow',
                        'DEBUG': 'green',
                        'TRACE': 'cyan',
                        'AUDIT': 'grey',
                        'MTRIC': 'grey'
                    }
                }

                const mqtt = require('mqtt')
                const client  = mqtt.connect('mqtt://localhost')

                return function(msg) {
                    // An example of filtering the log output - adjust to your needs
                    if ( msg.level < 51 || msg.msg.includes('[uibuilder') || msg.msg.includes('[uib-') || msg.msg.startsWith('+-') || msg.msg.startsWith('| ') || msg.msg.startsWith('>>') ) {
                        client.publish( 'nrlog/dev', JSON.stringify(msg) )
                    }
                }
            }
        },
        */
    },

    /** Context Storage
     * The following property can be used to enable context storage. The configuration
     * provided here will enable file-based context that flushes to disk every 30 seconds.
     * Refer to the documentation for further options: https://nodered.org/docs/api/context/
     *
     * Default is to use 'memory' only.
     * 'memory' and 'localfilesystem' are both synchronous.
     */
    contextStorage: {
        default: {
            module: 'memory',
        },
        file: {
            module: 'localfilesystem',
            // config: {
            //     flushInterval: '10', // default is 30s
            //     dir: '/home/user/.node-red/context',
            // },
        },
    },

    /** `global.keys()` returns a list of all properties set in global context.
     * This allows them to be displayed in the Context Sidebar within the editor.
     * In some circumstances it is not desirable to expose them to the editor. The
     * following property can be used to hide any property set in `functionGlobalContext`
     * from being list by `global.keys()`.
     * By default, the property is set to false to avoid accidental exposure of
     * their values. Setting this to true will cause the keys to be listed.
     */
    exportGlobalContextKeys: false,

    /** Configure how the runtime will handle external npm modules.
     * This covers:
     *  - whether the editor will allow new node modules to be installed
     *  - whether nodes, such as the Function node are allowed to have their
     *    own dynamically configured dependencies.
     * The allow/denyList options can be used to limit what modules the runtime
     * will install/load. It can use '*' as a wildcard that matches anything.
     * NOTE that external modules are installed to `<userDir>`
     */
    externalModules: {
        // autoInstall: false,   // Whether the runtime will attempt to automatically install missing modules
        // autoInstallRetry: 30, // Interval, in seconds, between reinstall attempts
        // palette: {              // Configuration for the Palette Manager
        //     allowInstall: true, /** Enable the Palette Manager in the editor */
        //     allowUpdate: true,  /** Allow modules to be updated in the Palette Manager */
        //     allowUpload: true,  /** Allow module tgz files to be uploaded and installed */
        //     allowList: ['*'],
        //     denyList: [],
        //     allowUpdateList: ['*'],
        //     denyUpdateList: []
        // },
        // modules: {              // Configuration for node-specified modules
        //     allowInstall: true,
        //     allowList: [],
        //     denyList: []
        // }
    },

    //#endregion ----- Runtime Settings ----- //

    //#region ----- Editor Settings ----- //
    /** *****************************************************************************
     * Editor Settings
     *  - disableEditor
     *  - editorTheme
     ******************************************************************************/

    /** The following property can be used to disable the editor. The admin API
     * is not affected by this option. To disable both the editor and the admin
     * API, use either the httpRoot or httpAdminRoot properties
     */
    // disableEditor: false,

    /** Customising the editor
     * favicon, page title, header text, header icon, deploy button, hide user menu, customise main menu, custom css, login logo
     * @see https://github.com/node-red/node-red/wiki/Design:-Editor-Themes for all available options.
     * @see https://github.com/node-red-contrib-themes/ for themes list
     * `npm install @node-red-contrib-themes/theme-collection` in userDir
     */
    editorTheme: {
        // theme: 'midnight-red-scroll', //'dracula-scroll', //'solarized-light-scroll',

        /** To disable the 'Welcome to Node-RED' tour that is displayed the first
         * time you access the editor for each release of Node-RED, set this to false
         */
        // tours: false,

        /** The following property can be used to order the categories in the editor
         * palette. If a node's category is not in the list, the category will get
         * added to the end of the palette.
         * If not set, the following default order is used:
         */
        palette: {
            // categories: ['subflows', 'common', 'function', 'network', 'sequence', 'parser', 'storage'],

            /** Alternative palette manager catalogues */
            // catalogues: [
            //     'https://catalogue.nodered.org/catalogue.json'
            // ],

            /** Override node colours - rules test against category/type by RegExp. */
            // theme: [
            //     { category: '.*', type: '.*', color: '#f0f' } // Makes ALL nodes PINK!
            // ]

            // *Deprecated* - use externalModules.palette.allowInstall instead
            // editable: true,
        },

        projects: {
            /** To enable the Projects feature, set this value to true */
            enabled: false,
            workflow: {
                /** Set the default projects workflow mode.
                 *    - manual - you must manually commit changes.
                 *    - auto - changes are automatically committed.
                 * This can be overridden per-user from the 'Git config'
                 *   section of 'User Settings' within the editor.
                 */
                mode: 'manual', // 'auto',
            },
        },

        codeEditor: {
            /** Select the text editor component used by the editor.
             *  As of Node-RED V3, this defaults to "monaco", but can be set to "ace" if desired
             */
            lib: 'monaco', // 'ace',
            options: {
                /** The follow options only apply if the editor is set to "monaco"
                 * https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IStandaloneEditorConstructionOptions.html
                 *
                 * theme - must match the file name of a theme in
                 * packages/node_modules/@node-red/editor-client/src/vendor/monaco/dist/theme
                 * e.g. "tomorrow-night", "upstream-sunburst", "github", "my-theme"
                 */
                theme: 'vs-dark', // 'vs',
                /** other overrides can be set e.g. fontSize, fontFamily, fontLigatures etc.
                 * for the full list, see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandaloneeditorconstructionoptions.html
                 */
                fontSize: 14,
                // fontFamily: "Cascadia Code, Fira Code, Consolas, 'Courier New', monospace",
                fontFamily: 'Consolas, "Courier New", monospace',
                fontLigatures: false,
                colorDecorators: true,
                dragAndDrop: true,
                linkedEditing: true,
                minimap: { enabled: false },
                mouseWheelZoom: true,
                showFoldingControls: 'always',
                useTabStops: true,
                tabSize: 4,
                bracketPairColorization: { enabled: true },
            },
        },

        /** Make changes to the Editor's header bar */
        /*
        header: {
            title: 'DEVELOPMENT (Local)',
            // image: "/absolute/path/to/header/image", // or null to remove image
            url: '//home.local' // optional url to make the header text/image a link to this url
        },
        */

        /** Load additional resources to the Editor page */
        /*
        page: {
            // css: '/src/nr-source/ti-theme/ti-editor-styles.css',
            // scripts: '/src/nr-source/ti-theme/ti-editor-fns.js',
        },
        */

        /** Hide unwanted menu items by id. see editor/js/main.js:loadEditor for complete list */
        // menu: {
        //     "menu-item-import-library": false,
        //     "menu-item-export-library": false,
        //     "menu-item-keyboard-shortcuts": false,
        //     "menu-item-help": {
        //         label: "Alternative Help Link Text",
        //         url: "http://example.com"
        //     }
        // },

        /** Configure the description editor */
        markdownEditor: {
            /** enable or disable mermaid diagram in markdown document
             * Default: false (disabled) - set to true to enable
             */
            mermaid: { enabled: true }
        },

        /** To enable the Multiplayer feature, set this value to true */
        // multiplayer: { enabled: false },
    },
    //#endregion ----- Editor Settings ----- //

    //#region ---- Specific Node Settings ---- //
    /** *****************************************************************************
     * Node Settings
     *  - fileWorkingDirectory
     *  - functionGlobalContext
     *  - functionExternalModules
     *  - globalFunctionTimeout
     *  - functionTimeout
     *  - nodeMessageBufferMaxLength
     *  - ui (for use with Node-RED Dashboard)
     *  - debugUseColors
     *  - debugMaxLength
     *  - debugStatusLength
     *  - execMaxBufferSize
     *  - httpRequestTimeout
     *  - mqttReconnectTime
     *  - serialReconnectTime
     *  - socketReconnectTime
     *  - socketTimeout
     *  - tcpMsgQueueSize
     *  - inboundWebSocketTimeout
     *  - tlsConfigDisableLocalFiles
     *  - webSocketNodeVerifyClient
     ******************************************************************************/

    /** The working directory to handle relative file paths from within the File nodes
     * defaults to the working directory of the Node-RED process.
     */
    // fileWorkingDirectory: '',

    /** Allow external modules to be specified in function nodes
     * See https://nodered.org/docs/user-guide/writing-functions#using-the-functionexternalmodules-option
     */
    functionExternalModules: true, // default: true

    /** The default timeout (in seconds) for all Function nodes.
     * Individual nodes can set their own timeout value within their configuration.
     */
    globalFunctionTimeout: 0,

    /** The default timeout (in seconds) for the Function node. 0 means no timeout is applied
     * This value is applied when the node is first added to the workspace - any changes
     * must then be made with the individual node configurations.
     * To set a global timeout value, use `globalFunctionTimeout`
     */
    functionTimeout: 0,

    /** Default timeout, in seconds, for the Function node. 0 means no timeout is applied
      * This value is applied when the node is first added to the workspace - any changes
      * must then be made with the individual node configurations.
      * To set a global timeout value, use `globalFunctionTimeout`
     */
    functionTimeout: 0,

    /** The following property can be used to set predefined values in Global Context.
     * This allows extra node modules to be made available with in Function node.
     * For example, the following:
     *    functionGlobalContext: { os:require('os') }
     * will allow the `os` module to be accessed in a Function node using:
     *    global.get("os")
     */
    /*
    functionGlobalContext: {
        _pid: process.pid, // Node-RED process ID, allows a flow to stop Node-RED
        _env: process.env,  // Pass ALL environment vars to Node-RED - dangerous
        _userid: process.env.user || process.env.username || process.env.USER,
        _userHome: process.env.home || process.env.userhome || process.env.HOME,
        _hostName: require('os').hostname(),
        _userDir: __dirname,
        _port: this.uiPort,
        // require: require,   // DANGER Will Robinson!
    },
    */

    /** The maximum number of messages nodes will buffer internally as part of their
     * operation. This applies across a range of nodes that operate on message sequences.
     * Defaults to no limit. A value of 0 also means no limit is applied.
     */
    // nodeMessageBufferMaxLength: 0,

    /** If you installed the optional node-red-dashboard you can set it's path relative to httpNodeRoot
     *  Other optional properties include
     *    readOnly:{boolean},
     *    middleware:{function or array}, (req,res,next) - http middleware
     *    ioMiddleware:{function or array}, (socket,next) - socket.io middleware
     */
    // ui: { path: 'ui' },

    /** Colourise the console output of the debug node */
    // debugUseColors: true,

    /** The maximum length, in characters, of any message sent to the debug sidebar tab, default=1000 */
    debugMaxLength: 2048, // default: 1000

    /** The maximum length, in characters, of status messages under the debug node */
    //debugStatusLength: 32,

    /** Maximum buffer size for the exec node. Defaults to 10Mb */
    // execMaxBufferSize: 10000000,

    /** Timeout in milliseconds for HTTP request connections. Defaults to 120s */
    // httpRequestTimeout: 120000,

    /** Retry time in milliseconds for MQTT connections */
    mqttReconnectTime: 15000,

    /** Retry time in milliseconds for Serial port connections */
    serialReconnectTime: 15000,

    /** Retry time in milliseconds for TCP socket connections */
    // socketReconnectTime: 10000,

    /** Timeout in milliseconds for TCP server socket connections. Defaults to no timeout */
    // socketTimeout: 120000,

    /** Maximum number of messages to wait in queue while attempting to connect to TCP socket. Defaults to 1000 */
    // tcpMsgQueueSize: 2000,

    /** Timeout in milliseconds for inbound WebSocket connections that do not
     *  match any configured node. Defaults to 5000
     */
    // inboundWebSocketTimeout: 5000,

    /** To disable the option for using local files for storing keys and certificates
     * in the TLS configuration node, set this to true
     */
    // tlsConfigDisableLocalFiles: true,

    /** Params for optional callback for webSocketNodeVerifyClient
     * @callback wsVerifyCallback
     * @param {boolean} result whether to accept the connection or not
     * @param {number} code if result is false, the HTTP error status to return
     * @param {string} reason if result is false, the HTTP reason string to return
     */

    /** The following property can be used to verify websocket connection attempts.
     *  This allows, for example, the HTTP request headers to be checked to ensure
     *  they include valid authentication information.
     *
     * WARNING: Verify only works on initial socket connection.
     *          This is a weakness of websockets not Node-RED
     *
     * @param {object} info Info object
     * @param {string} info.origin the value in the Origin header
     * @param {object} info.req the HTTP request
     * @param {boolean} info.secure true if req.connection.authorized or req.connection.encrypted is set
     * @param {wsVerifyCallback} [callback] Optional. Verify the client asynchronously
     *
     * @returns {boolean} The function should return true if the connection should be accepted, false otherwise.
     */
    // webSocketNodeVerifyClient: function(info /* , callback */) {
    //     console.log('WEBSOKCETNODEVERIFYCLIENT: ', info)
    //     return true
    // },

    // ===== Custom Node Settings ===== //

    /** FlowFuse Dashboard 2 */
    dashboard: {
        /** Custom ExpressJS middleware */
        // middleware: (request, response, next) => {
        //     console.log(`New dashboard request from ${request.ip} to ${request.path}`)
        //     next()
        // },
        /** Custom Socket.IO middleware
         * @param {*} socket 
         * @param {*} next 
         */
        // ioMiddleware: (socket, next) => {
        //     if (isValid(socket.request)) {
        //         next();
        //     } else {
        //         next(new Error("invalid"));
        //     }
        // },
        /** Max message size (default=1mb=1e6) */
        // maxHttpBufferSize: 1e6,
    },

    /** Custom settings for all uibuilder node instances */
    // uibuilder: {
    //     /** Optional HTTP PORT.
    //      * If set and different to Node-RED's uiPort, uibuilder will create
    //      * a separate webserver for its own use.
    //      */
    //     port: process.env.UIBPORT || 3001,

    //     /** Optional: Change location of uibRoot
    //      * If set, instead of something like `~/.node-red/uibuilder`, the uibRoot folder can be anywhere you like.
    //      */
    //     uibRoot: process.env.UIBROOT || path.join(os.homedir(), 'myuibroot'),
    //     // For project-specific uibuilder folders:
    //     // uibRoot: path.join(os.homedir(), '.node-red', 'projects', 'uibuilder')

    //     /** Only used if a custom ExpressJS server in use (see port above)
    //      * Optional: Default will be the same as Node-RED. @type {('http'|'https')}
    //      */
    //     customType: 'https',

    //     /** Only required if type is https, http2. Defines the cert & key.
    //      * See Node-RED https settings for more details.
    //      * If not defined, will use Node-RED's https properties.
    //      * @type {Object<Buffer,Buffer>}
    //      */
    //     https: {
    //         key: fs.readFileSync( path.join(os.homedir(), '.acme', 'LocalHTTPSDevCertificate.key') ),
    //         cert: fs.readFileSync( path.join(os.homedir(), '.acme', 'LocalHTTPSDevCertificate.crt') )
    //     },

    //     /** Optional: Custom ExpressJS server options
    //      *  Only required if using a custom webserver (see port setting above).
    //      * Available options: http://expressjs.com/en/api.html#app.settings.table
    //      */
    //     serverOptions: {
    //         // http://expressjs.com/en/api.html#trust.proxy.options.table
    //         'trust proxy': true,  // true/false; or subnet(s) to trust; or custom function returning true/false. default=false
    //         /** Optional view engine - the engine must be pre-installed into your userDir
    //          * (e.g. where this settings.js file lives)
    //          * If set as shown, ExpressJS will translate source files ending in .ejs to HTML.
    //          * See https://expressjs.com/en/guide/using-template-engines.html for details.
    //          */
    //         'view engine': 'ejs',
    //         // Optional global settings for view engine
    //         'view options': {},

    //         // Custom properties: can be used as vars in view templates
    //         'footon': 'bar stool',
    //     },

    //     /** Optional: Socket.IO Server options
    //      * See https://socket.io/docs/v4/server-options/
    //      * Note that the `path` property will be ignored, it is set by uibuilder itself.
    //      * You can set anything else though you might break uibuilder unless you know what you are doing.
    //      * @type {object}
    //      */
    //     // socketOptions: {
    //     //     // Make the default msg buffer larger (default=1MB)
    //     //     maxHttpBufferSize: 1e8 // 100 MB
    //     // },

    //     /** Controls whether the uibuilder instance API feature is enabled
    //      *  Off by default since uncontrolled instance api's are a security and
    //      *  operational risk. Use with caution. See Docs for details.
    //      */
    //     instanceApiAllowed: true,

    //     hooks: {
    //         /** Hook fn run every time any uibuilder node receives a message from the front-end client.
    //          * You CAN:
    //          * - Stop the inbound msg by returning false.
    //          * - Change the msg that is received before it is output.
    //          * You _could_ change the node's values BUT DO NOT! Bad things likely to happen if you do.
    //          * @param {object} data
    //          * @param {object} data.msg READ/WRITE. The msg that is being sent
    //          * @param {object} data.node READ-ONLY! The settings of the node sending the message
    //          * @returns {boolean} true = receive the msg. false = block the msg.
    //          */
    //         msgReceived: (data) => {
    //             const {msg, node} = data

    //             // console.log('hooks:msgReceived - msg: ', msg)
    //             // console.log('hooks:msgReceived - uibuilder url: ', node.url)

    //             if (msg.blockme) return false // simplistic example
                                
    //             // Example of altering the msg
    //             // msg._hook = 'I WAS HOOKED!'

    //             // Block inputs except from logged in users
    //             // if (!msg._client) return false

    //             // Default, allows msgs to flow
    //             return true
    //         },
    //         /** Hook fn run every time any uibuilder node is sending a msg to a front-end client
    //          * This could therefore get run thousands of times! So best to filter up front as shown.
    //          * You CAN:
    //          * - stop the outbound msg by returning false.
    //          * - Change the msg that is sent
    //          * You _could_ change the node's values BUT DO NOT! Bad things likely to happen if you do.
    //          * @param {object} data
    //          * @param {object} data.msg READ/WRITE. The msg that is being sent
    //          * @param {uibNode} data.node READ-ONLY! The settings of the node sending the message
    //          * @returns {boolean} true = receive the msg. false = block the msg.
    //          */
    //         msgSending: (data) => {
    //             const {msg, node} = data

    //             // You generally want to let things through as early as possible for efficiency.
    //             // Filter by node.url, if url is not equal to 'test', then allow the msg's to flow as normal
    //             // if (node.url !== 'test') return true

    //             // Filter to restrict by topic - only allow anything through if topic is 'test'
    //             // if (msg.topic !== 'test') return false

    //             // console.log('hooks:msgReceived - msg: ', msg)
    //             // console.log('hooks:msgReceived - uibuilder url: ', node.url)

    //             // Block message sending if msg.blockme is set to true
    //             if (msg.blockme) return false // simplistic example

    //             // Block outputs except to logged in users
    //             // if (!msg._client) return false

    //             // Default, allows msgs to flow
    //             return true
    //         },
    //         /** Hook fn run whenever uibuilder looks up a connected client's details. NOTE:
    //          * This will be run every time a client connects AND every time it sends a msg to Node-RED.
    //          * This lets you amend the details including out._client which can contain authenticated user details.
    //          * @param {object} data
    //          *   @param {object} data.client Key client information - this can be amended in this fn
    //          *     @param {object} data.client._uib Standard uibuilder client meta info
    //          *     @param {object=} data.client._client Only if a recognised authenticated client
    //          *   @param {socketio.Socket} data.socket Reference to client socket connection
    //          * @param {object} data.node READ-ONLY! The settings of the node sending the message
    //          */
    //         clientDetails: (data) => {
    //             const {client, socket, node} = data

    //             // Quick and dirrty way to stop ALL clients from connecting if client._client object is not set
    //             // See: https://totallyinformation.github.io/node-red-contrib-uibuilder/#/security/authenticated-client-properties
    //             // if (!client?._client) return false

    //             // Show potentially useful client details in the log:
    //             // node.log(`🌐 [uibuilder:hooks:clientDetails] for ${node.url}:`)
    //             // console.log('socket.request.headers: ', socket.request.headers)
    //             // console.log('socket.handshake.auth: ', socket.handshake.auth)

    //             // Simplistic e.g. to block a specific user from being logged in
    //             if (client?._client?.userId === 'horrible.user') delete client._client
    //         },
    //         /** Hook fn that allows overrides of Socket.IO connection headers. NOTE:
    //          * Connection headers will only ever update when a client (re)connects or
    //          * possibly also for long-polling requests.
    //          * @see https://socket.io/docs/v4/server-api/#event-headers for details
    //          * @param {object} data 
    //          * @param {object<string:string>} data.headers Response Headers
    //          * @param {Express.Request} data.req ExpressJS Request object
    //          */
    //         socketIoHeaders: (data) => {
    //             const { headers, req } = data

    //             // headers contains the response headers that go back to the client.
    //             headers['x-wowser'] = 'The Client gets this'

    //             // Simulate an authenticated user
    //             // If these are set, a msg._client object is added to uibuilder output messages
    //             // req.headers['remote-user'] = 'test-user'
    //             // req.headers['remote-name'] = 'Test User'
    //             // req.headers['remote-email'] = 'test.user@example.com'
    //             // req.headers['x-user-role'] = 'test-role'
    //             // req.headers['x-forwarded-groups'] = 'group1,group2'

    //             // NB: This is NOT suitable for session controls since it will only update
    //             //     when a client (re)connects, not when otherwise sending/receiving msgs.
    //             //     Use the msgReceived amd msgSending hooks for session management.
    //         },
    //     },
    // },

    //#endregion ---- Specific Node Settings ---- //
} // ---- End of exports ---- //

// In case we want to use VScode to debug our node-red installation
// debugger

/** Splitting the export this way allows us to dynamically override settings if we want to */
nrsettings.functionGlobalContext._port = nrsettings.uiPort

module.exports = nrsettings
