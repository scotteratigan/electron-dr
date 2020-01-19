'use strict'
require('dotenv').config()
const net = require('net')
const client = new net.Socket()
const getConnectKey = require('./sge')
const makeLogger = require('./log')
const path = require('path')

function game(messageFrontEnd) {
  // Initialization Stuff:
  const globals = {}
  let parseXML = () => { }
  let filterXML = () => { }
  let log = defaultLogFn
  let unloadLogger = () => { }
  loadXMLparser() // loads or re-loads the parseXML function
  setupNewLogger()
  let sendTextToScript = () => { }
  let sendXMLeventToScript = () => { }

  // Actions / Runtime:

  async function sendCommand(command) {
    if (command.startsWith('.')) {
      // Need a global array of scripts to with parseText and XML events
      // Figure out sharing of globals array (read-only in scripts)

      console.log('prepare to launch script!')
      const scriptLoaderPath = path.join(__dirname, "loadscript.js")
      delete require.cache[scriptLoaderPath];
      const scriptLoader = require('./loadScript') // this needs to be reworked
      const loadScript = scriptLoader
      const scriptFunctions = await loadScript('script', sendCommand);
      sendTextToScript = scriptFunctions.sendTextToScript;
      sendXMLeventToScript = scriptFunctions.sendXMLeventToScript;
      return
    }
    if (command.startsWith("#echo ")) {
      const detail = command.substring(6);
      // if (!detail) return console.error("Echo called with no text?")
      return messageFrontEnd({ type: 'gametext', detail })
    }
    if (command.startsWith('#log ')) {
      const logText = command.substring(4) // strips out '#log '
      try {
        console.log('attempting to log...')
        log(logText)
      } catch (err) {
        console.error(`Unable to log text "${logText}"`)
      }
      return
    }
    if (command.startsWith('#xml')) {
      messageFrontEnd({
        type: 'gametext',
        detail: '*** Reloading XML Parser. ***',
      })
      return loadXMLparser()
    }
    if (command.startsWith('#var')) {
      return messageFrontEnd({ type: 'globals', globals })
    }
    if (command.startsWith('#')) {
      return messageFrontEnd({
        type: 'gametext',
        detail: 'Unknown command:' + command,
      })
    }

    sendCommandToGame(command)
  }

  let buffer = ''

  // Game sends data:
  client.on('data', data => {
    // detects incomplete data fragments - if line does not end with \r\n,
    // the data is split and we need to wait for the next packet before displaying/parsing all the data
    // This happens most frequently with logon text which is sent in huge chunks
    let gameStr = buffer + data.toString() // todo: use actual buffer here?
    if (!gameStr.match(/\r\n$/)) {
      buffer += gameStr
      return
    }
    buffer = ''

    // Parse XML for updates:
    try {
      parseXML(gameStr)
      const strCopy = gameStr.slice(0)
      // Send game data back to Main.js to pass on to client:
      const nonXMLtext = filterXML(strCopy)
      // Only send to front end if there is text to display:
      if (nonXMLtext) {
        messageFrontEnd({ type: 'gametext', detail: nonXMLtext })
        sendTextToScript(nonXMLtext);
      }
    } catch (err) {
      console.error('Uncaught error parsing xml:', err)
    }
    try {
      log(gameStr)
    } catch (err) {
      console.error('Unable to log to file:', err)
    }
  })

  client.on('close', function () {
    console.log('Connection closed.')
    messageFrontEnd({
      type: 'gametext',
      detail: 'Connection closed.'
    })
    log('Connection closed.')
    globals.connected = false;
    globalUpdated('connected')
    unloadLogger()
  })

  client.on('error', function (error) {
    console.error('Connection lost?:', error)
    messageFrontEnd({
      type: 'gametext',
      detail: 'Connection lost: ' + error.code,
    })
    globals.connected = false;
    globalUpdated('connected')
  })

  // Actual Connect process:

  function connect() {
    getConnectKey((connectKey, ip, port) => {
      console.log('Received connect key:', connectKey)
      client.connect(port, ip, function () {
        console.log('Connected, sending key.'.green)
        setTimeout(() => {
          client.write(connectKey + '\n')
        }, 0)
        setTimeout(() => {
          client.write('/FE:WIZARD /VERSION:1.0.1.22 /P:WIN_XP /XML\n')
        }, 100)
        setTimeout(() => {
          client.write('\n')
        }, 300)
        // todo: can we await specific text responses before sending this stuff instead of a timeout
      })
      globals.connected = true
      globalUpdated('connected')
    })
  }

  // Helper Functions:

  function sendCommandToGame(commands) {
    commands.split(';').forEach(command => {
      client.write(command + '\n')
      console.log('COMMAND: ' + command)
    })
  }

  function globalUpdated(global, detail = '') {
    // Forwards along the event and detail (hand or exp only for now) along with all global values:
    sendXMLeventToScript(global, detail, globals)
    messageFrontEnd({ type: global, detail, globals })
  }

  function loadXMLparser() {
    parseXML = () => { }
    filterXML = () => { }
    // Todo: replace with non-iterative solution. Need to find how to get root directory.
    for (const fullPath in require.cache) {
      if (fullPath.endsWith('xml.js')) delete require.cache[fullPath]
    }
    const setupXMLparser = require('./xml.js')
    parseXML = setupXMLparser(globals, globalUpdated)
    const setupXMLfilter = require('./filterxml.js')
    filterXML = setupXMLfilter()
  }

  function defaultLogFn() {
    console.log('Cannot log, log not set up yet.')
  }

  async function setupNewLogger() {
    // charName = "Anonymous", instance = "UI"
    const charName = 'Anonymous'
    const instance = 'UI'
    // todo: detect change in XML and switch to new logger when char name changes? or have some other global like profile name?
    console.log('makeLogger:', makeLogger)
    const logObjs = await makeLogger(charName, instance)
    log = logObjs.log
    unloadLogger = logObjs.unloadLogger
  }

  return { connect, sendCommand }
}

module.exports = game;