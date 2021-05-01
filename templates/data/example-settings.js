/**
 * Totally Information example Node-RED Settings file
 * @see ../node_modules/node-red/settings.js
 * @version Node-RED v1.3.2
 * 
 * This is the default settings file provided by Node-RED.
 *
 * It can contain any valid JavaScript code that will get run when Node-RED
 * is started.
 *
 * Lines that start with // are commented out.
 * Each entry should be separated from the entries above and below by a comma ','
 *
 * For more information about individual settings, refer to the documentation:
 *    https://nodered.org/docs/user-guide/runtime/configuration
 **/

const path = require('path')   // Node core library. path library for cross-platform file system specs
const fs   = require('fs')     // The `https` setting requires the `fs` module.
//const _    = require('lodash'); // lodash (improved underscore) for JS utility fns
 
/** Save a PID file so that Node-RED can be easily restarted even when run manually */
const pid = process.pid
console.info('PID: ', pid)
process.env.node_red_pid = pid+''
fs.readdir('.', (err, files)=>{
    if (err) throw err
 
    for (var i = 0, len = files.length; i < len; i++) {
        var match = files[i].match(/.*\.pid/)
        if(match !== null) fs.unlink(match[0], (err) => {
            if (err) throw err
        })
    }
 
    fs.writeFile(`${pid}.pid`, `${pid}`, (err) => {
        if (err) throw err
    })
})
 
/** Optionally display the Node.js/v8 engine heap size on startup */
const v8 = require('v8')
console.info(`V8 Total Heap Size: ${(v8.getHeapStatistics().total_available_size / 1024 / 1024).toFixed(2)} MB`)
 
module.exports = {
    /** the tcp port that the Node-RED web server is listening on */
    uiPort: process.env.PORT || 1880,
 
    /** By default, the Node-RED UI accepts connections on all IPv4 interfaces.
      * To listen on all IPv6 addresses, set uiHost to "::",
      * The following property can be used to listen on a specific interface. For
      * example, the following would only allow connections from the local machine.
      * This can be useful security when putting NR behind a reverse proxy on the same device.
      */
    //uiHost: process.env.HOST || '127.0.0.1',
 
    /** Retry time in milliseconds for MQTT connections */
    mqttReconnectTime: 15000,
 
    /** Retry time in milliseconds for Serial port connections */
    serialReconnectTime: 15000,
 
    /** Retry time in milliseconds for TCP socket connections */
    //socketReconnectTime: 10000,
 
    /** Timeout in milliseconds for TCP server socket connections, defaults to no timeout */
    //socketTimeout: 120000,
 
    /** Maximum number of messages to wait in queue while attempting to connect to TCP socket, defaults to 1000 */
    //tcpMsgQueueSize: 2000,
 
    /** Timeout in milliseconds for HTTP request connections - defaults to 120 seconds */
    //httpRequestTimeout: 120000,
 
    /** Maximum buffer size for the exec node - defaults to 10Mb */
    //execMaxBufferSize: 10000000,
 
    /** The maximum length, in characters, of any message sent to the debug sidebar tab, default=1000 */
    debugMaxLength: 2048,
 
    /* The maximum number of messages nodes will buffer internally as part of their
      * operation. This applies across a range of nodes that operate on message sequences.
      *  defaults to no limit. A value of 0 also means no limit is applied.
      */
    //nodeMessageBufferMaxLength: 0,
 
    /** To disable the option for using local files for storing keys and certificates 
      * in the TLS configuration node, set this to true
      */
    //tlsConfigDisableLocalFiles: true,
 
    /** Colourise the console output of the debug node */
    //debugUseColors: true,
 
    /** The file containing the flows. If not set, it defaults to flows_<hostname>.json */
    //flowFile: 'flows.json',
 
    /** To enabled pretty-printing of the flow within the flow file, 
      *  set the following property to true:
      */
    //flowFilePretty: true,
 
    /** By default, credentials are encrypted in storage using a generated key. To
      * specify your own secret, set the following property.
      * If you want to disable encryption of credentials, set this property to false.
      * Note: once you set this property, do not change it - doing so will prevent
      * node-red from being able to decrypt your existing credentials and they will be
      * lost.
      */
    credentialSecret: 'a-secret-key',
 
    /** By default, all user data is stored in a directory called `.node-red` under
      * the user's home directory. To use a different location, the following
      * property can be used
      */
    //userDir: path.join(os.homedir(), '.node-red')',
 
    /** Node-RED scans the `nodes` directory in the userDir to find local node files.
      * The following property can be used to specify an additional directory to scan.
      */
    //nodesDir: path.join(os.homedir(), '.node-red', 'nodes')',
 
    /** By default, the Node-RED UI is available at http://localhost:1880/
      * The following property can be used to specify a different root path.
      * If set to false, this is disabled.
      *  WARNING: If left unset or set to a path that user paths sit beneath,
      *           any admin middleware such as the httpAdminMiddleware function
      *           will also run for those user paths.
      *           This can have unintended consequences.
      */
    //httpAdminRoot: process.env.httpAdminRoot || '/admin',
 
    /** Some nodes, such as HTTP In, can be used to listen for incoming http requests.
      * By default, these are served relative to '/'. The following property
      * can be used to specifiy a different root path. If set to false, this is
      * disabled.
      */
    //httpNodeRoot: process.env.httpNodeRoot || '/red-nodes',
 
    /** The following property can be used in place of 'httpAdminRoot' and 'httpNodeRoot',
      * to apply the same root to both parts. Defaults to '/'.
      */
    //httpRoot: process.env.httpRoot || '/red',
 
    /** When httpAdminRoot is used to move the UI to a different root path, the
      *  following property can be used to identify a directory of static content
      *  that should be served at http://localhost:1880/.
      */
    //httpStatic: process.env.httpStatic || path.join('.', 'node-red-static'),
 
    /** The maximum size of HTTP request that will be accepted by the runtime api. Default: 5mb */
    //apiMaxLength: '5mb',
 
    /** If you installed the optional node-red-dashboard you can set it's path relative to httpRoot
      *  Other optional properties include
      *    readOnly:{boolean},
      *    middleware:{function or array}, (req,res,next) - http middleware
      *    ioMiddleware:{function or array}, (socket,next) - socket.io middleware
      */
    //ui: { path: 'ui' },
 
    //#region ------ Securing Node-RED ------ //
 
    /** To password protect the Node-RED editor and admin API, the following
      * property can be used. See http://nodered.org/docs/security.html for details.
      */
    /* adminAuth: {
        type: "credentials",
        users: [{
            username: 'admin',
            password: '$2a$08$XPzmmEYTvmUI75ajrc.mheyvRKSoZAUwQYDgdmlYLUp3eP6JQrz1m', //pw
            permissions: '*',
        }]
    }, */
 
    /** To password protect the node-defined HTTP endpoints (httpNodeRoot), or
      * the static content (httpStatic), the following properties can be used.
      * The pass field is a bcrypt hash of the password.
      * See http://nodered.org/docs/security.html#generating-the-password-hash
      */
    //httpNodeAuth: {user:'user',pass:'$2a$08$XPzmmEYTvmUI75ajrc.mheyvRKSoZAUwQYDgdmlYLUp3eP6JQrz1m'}, //pass="pw"
    //httpStaticAuth: {user:'user',pass:'$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN.'},
 
    /** The following property can be used to enable HTTPS
      * See http://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
      * for details on its contents.
      * See the comment at the top of this file on how to load the `fs` module used by
      * this setting.
      */
    /* https: {
         key: fs.readFileSync( path.join(os.homedir(), '.acme.sh', '<domain folder>', '<keyname>.key') ),
         cert: fs.readFileSync( path.join(os.homedir(), '.acme.sh', '<domain folder>', 'fullchain.cer') )
     }, */
    /** Alternatively:
         https: function() {
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
 
    /** The following property can be used to refresh the https settings at a
      *  regular time interval in hours.
      *  This requires:
      *  - the `https` setting to be a function that can be called to get the refreshed settings.
      *  - Node.js 11 or later.
      */
    //httpsRefreshInterval : 12,
 
    /** The following property can be used to cause insecure HTTP connections to
      * be redirected to HTTPS.
      */
    //requireHttps: true,
 
    /** The following property can be used to disable the editor. The admin API
      * is not affected by this option. To disable both the editor and the admin
      * API, use either the httpRoot or httpAdminRoot properties
      */
    //disableEditor: false,
 
    /** The following property can be used to configure cross-origin resource sharing
      * in the HTTP nodes.
      * See https://github.com/troygoode/node-cors#configuration-options for
      * details on its contents. The following is a basic permissive set of options:
      */
    /* httpNodeCors: {
         origin: "*",
         methods: "GET,PUT,POST,DELETE"
     }, */
 
    /** If you need to set an http proxy please set an environment variable
      * called http_proxy (or HTTP_PROXY) outside of Node-RED in the operating system.
      * For example - http_proxy=http://myproxy.com:8080
      * (Setting it here will have no effect)
      * You may also specify no_proxy (or NO_PROXY) to supply a comma separated
      * list of domains to not proxy, eg - no_proxy=.acme.co,.acme.co.uk
      */
 
    /** The following property can be used to add a custom middleware function
      *   in front of all http in nodes. This allows custom authentication to be
      *   applied to all http in nodes, or any other sort of common request processing.
      * NOTE that this property may be an ARRAY of functions or a single function.
      * 
     * @param {import("express").Request} req The ExpressJS request object
     * @param {import("express").Response} res The ExpressJS response object
     * @param {import("express").NextFunction} next Function that MUST be called at the end of this function so that further ExpressJS middleware functions will be chained
     */
    httpNodeMiddleware: function(req,res,next) {
        // Handle/reject the request, or pass it on to the http in node by calling next();

        // Optionally skip our rawBodyParser by setting this to true;
        //req.skipRawBodyParser = true;
 
        // res.setHeader('x-powered-by','Node-RED')
        // res.setHeader('x-environment','Dev Node')
 
        // Help reduce risk of XSS and other attacks
        res.setHeader('X-XSS-Protection','1;mode=block')
        res.setHeader('X-Content-Type-Options','nosniff')
        //res.setHeader('X-Frame-Options','SAMEORIGIN')
        //res.setHeader('Content-Security-Policy',"script-src 'self'")
        
        next()
    },
 
    /** The following property can be used to add a custom middleware function
      *   in front of all admin http routes. For example, to set custom http headers.
      * NOTE that this property may be an ARRAY of functions or a single function.
      * 
      * @param {import("express").Request} req The ExpressJS request object
      * @param {import("express").Response} res The ExpressJS response object
      * @param {import("express").NextFunction} next Function that MUST be called at the end of this function so that further ExpressJS middleware functions will be chained
      */ 
    httpAdminMiddleware: function(req,res,next) {
        // Set the X-Frame-Options header to limit where the editor can be embedded
        res.set('X-Frame-Options', 'sameorigin')
        //res.setHeader('x-environment2','Dev Admin')
        next()
    },
 
    /** The following property can be used to pass custom options to the Express.js
      * server used by Node-RED. For a full list of available options, refer
      * to http://expressjs.com/en/api.html#app.settings.table
      */
    httpServerOptions: {
        // http://expressjs.com/en/api.html#trust.proxy.options.table
        // 'trust proxy': true,  // true/false; or subnet(s) to trust; or custom function returning true/false. default=false
        'x-powered-by': false,
    },
 
    /** Optional callback for webSocketNodeVerifyClient
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
      * @param {Object} info
      * @param {string} info.origin the value in the Origin header
      * @param {import("express").Request} info.req the HTTP request
      * @param {boolean} info.secure true if req.connection.authorized or req.connection.encrypted is set
      * @param {wsVerifyCallback} [callback] Optional. Verify the client asynchronously
      * 
      * @return {boolean} The function should return true if the connection should be accepted, false otherwise.
      */
    webSocketNodeVerifyClient: function(info /* , callback */) {
        console.log('WEBSOKCETNODEVERIFYCLIENT: ', info)
        return true
    },
     
    //#endregion ----- Securing Node-RED ----- //
 
    /** The following property can be used to seed Global Context with predefined
      * values. This allows extra node modules to be made available with the
      * Function node.
      * For example,
      *    functionGlobalContext: { os:require('os') }
      * can be accessed in a function block as:
      *    global.get("os")
      */
    functionGlobalContext: {
        _pid: process.pid,
        // _env: process.env,  // Pass ALL environment vars to Node-RED
        // _userid: process.env.user || process.env.username || process.env.USER,
        // _userHome: process.env.home || process.env.userhome || process.env.HOME,
        // _hostName: require('os').hostname(),
        // require: require,   // DANGER Will Robinson!
        //_: require('lodash'),
    },
 
    /** Allow the Function node to load additional npm modules. Default = false. */
    functionExternalModules: false,
 
    /** `global.keys()` returns a list of all properties set in global context.
      * This allows them to be displayed in the Context Sidebar within the editor.
      * In some circumstances it is not desirable to expose them to the editor. The
      * following property can be used to hide any property set in `functionGlobalContext`
      * from being list by `global.keys()`.
      * By default, the property is set to false to avoid accidental exposure of
      * their values. Setting this to true will cause the keys to be listed.
      */
    exportGlobalContextKeys: false,
 
    /** Context Storage
      * The following property can be used to enable context storage. The configuration
      * provided here will enable file-based context that flushes to disk every 30 seconds.
      * Refer to the documentation for further options: https://nodered.org/docs/api/context/
      * 
      * Default is to use 'memory' only.
      * 'memory' and 'localfilesystem' are both synchronous.
      */
    /* contextStorage: {
        default: {
            module:'memory',
        },
        file: {
            module: 'localfilesystem',
            // Optionally control how often variables are flushed to the filing system
            // config: {
            //     flushInterval: '10', // default is 30s
            // },
        },
    }, */
 
    /** The following property can be used to order the categories in the editor
      * palette. If a node's category is not in the list, the category will get
      * added to the end of the palette.
      * If not set, the following default order is used:
      */
    //paletteCategories: ['subflows', 'input', 'output', 'function', 'social', 'mobile', 'storage', 'analysis', 'advanced'],
 
    /** Configure the logging output */
    logging: {
        /** Only console logging is currently supported */
        console: {
            /** Level of logging to be recorded. Options are:
              * fatal - only those errors which make the application unusable should be recorded.
              * error - record errors which are deemed fatal for a particular request + fatal errors.
              * warn - record problems which are non fatal + errors + fatal errors.
              * info - record information about the general running of the application + warn + error + fatal errors.
              * debug - record information which is more verbose than info + info + warn + error + fatal errors.
              * trace - record very detailed logging + debug + info + warn + error + fatal errors.
              * off - turn off all logging (doesn't affect metrics or audit).
              */
            level: 'info',
            /** Whether or not to include metric events in the log output */
            metrics: false,
            /** Whether or not to include audit events in the log output */
            audit: false,
        }
    },
 
    /** Configure how the runtime will handle external npm modules.
      * This covers:
      *  - whether the editor will allow new node modules to be installed
      *  - whether nodes, such as the Function node are allowed to have their
      *    own dynamically configured dependencies.
      * The allow/denyList options can be used to limit what modules the runtime
      * will install/load. It can use '*' as a wildcard that matches anything.
      * NOTE that external modules are installed to `<userDir>/externalModules`
      * For more information, @see https://nodered.org/blog/2021/04/08/version-1-3-released#function-node-use-of-npm-modules
      */
    externalModules: {
        // autoInstall: false,   // Whether the runtime will attempt to automatically install missing modules
        // autoInstallRetry: 30, // Interval, in seconds, between reinstall attempts
        // palette: {              // Configuration for the Palette Manager
        //     allowInstall: true, // Enable the Palette Manager in the editor
        //     allowUpload: true,  // Allow module tgz files to be uploaded and installed
        //     allowList: [],
        //     denyList: []
        // },
        // modules: {              // Configuration for node-specified modules
        //     allowInstall: true,
        //     allowList: [],
        //     denyList: []
        // }
    },
 
    /** Customising the editor
      * projects, theme, favicon, page title, header text, header icon, deploy button, hide user menu, customise main menu, custom css, login logo
      * For information on theme overrides in this section @see https://github.com/node-red/node-red/wiki/Design:-Editor-Themes and 
      *   https://nodered.org/docs/user-guide/runtime/configuration#editor-themes
      */
    editorTheme: {        
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
                mode: 'manual'
            },
        },
 
        /** Use a named theme
         * For more information, @see https://github.com/node-red-contrib-themes/theme-collection
         */
        theme: 'solarized-light-scroll',
 
        header: {
            title: 'DEVELOPMENT (Local)',
            //image: "/absolute/path/to/header/image", // or null to remove image
            url: 'https://home.knightnet.co.uk' // optional url to make the header text/image a link to this url
        },
         
        /* palette: {
             // *Deprecated* - use externalModules.palette.allowInstall instead
             //editable: true,
 
             // Alternative palette manager catalogues
             // catalogues: [   
             //     'https://catalogue.nodered.org/catalogue.json'
             // ],
 
             // Override node colours - rules test against category/type by RegExp.
             // theme: [
             //     { category: '.*', type: '.*', color: '#f0f' } // Makes ALL nodes PINK!
             // ]
         }, */
    },

}
 
//EOF