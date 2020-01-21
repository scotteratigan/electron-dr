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
  let rawLog = () => { }
  let gameLog = () => { }
  let unloadRawLogger = () => { }
  let unloadGameLogger = () => { }
  loadXMLparser() // loads or re-loads the parseXML function
  setupNewLogger()
  let sendTextToScript = () => { }
  let sendXMLeventToScript = () => { }
  let sendControlCommandToScript = () => { }
  let scriptLoader;

  // Actions / Runtime:

  async function sendCommand(command) {
    if (command.startsWith('.')) {
      // Need a global array of scripts to with parseText and XML events
      // Figure out sharing of globals array (read-only in scripts)
      console.log('prepare to launch script!')
      const scriptLoaderPath = path.join(__dirname, "loadscript.js")
      delete require.cache[scriptLoaderPath]
      scriptLoader = null;
      sendTextToScript = () => { }
      sendXMLeventToScript = () => { }
      sendControlCommandToScript = () => { }
      scriptLoader = require('./loadScript') // this needs to be reworked
      const loadScript = scriptLoader
      const scriptFunctions = await loadScript('script', sendCommand)
      sendTextToScript = scriptFunctions.sendTextToScript;
      sendXMLeventToScript = scriptFunctions.sendXMLeventToScript
      sendControlCommandToScript = scriptFunctions.sendControlCommandToScript
      sendXMLeventToScript("all", "", globals) // so that script initializes with variables - should wait for this in script
      return
    }
    if (command.startsWith("#abort")) {
      console.log('*** Abort signal received from client ***');
      return sendControlCommandToScript("#abort")
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
        rawLog(logText)
        gameLog(logText)
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

  let buffer = []

  // Game sends data:
  client.on('data', data => {
    // detects incomplete data fragments, mostly on login
    // if line does not end with \r\n, the packet was fragmented
    // assemble all text before displaying

    const dataStr = data.toString()
    dataStr.split('').forEach(letter => buffer.push(letter))
    if (!dataStr.match(/\r\n$/)) {
      return
    }
    const gameStr = buffer.join('')
    buffer = []
    console.log('------------------------------')
    console.log(gameStr)
    // Parse XML for updates:
    try {
      parseXML(gameStr)
      // Send game data back to Main.js to pass on to client:
      const nonXMLtext = filterXML(gameStr)
      // Only send to front end if there is text to display:
      if (nonXMLtext) {
        gameLog(nonXMLtext);
        sendTextToScript(nonXMLtext);
        messageFrontEnd({ type: 'gametext', detail: nonXMLtext })
      }
    } catch (err) {
      console.error('Uncaught error parsing xml:', err)
    }
    try {
      rawLog(gameStr)
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
    rawLog('Connection closed.')
    gameLog('Connection closed.')
    globals.connected = false;
    globalUpdated('connected')
    unloadRawLogger()
    unloadGameLogger()
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
        const lineEnding = "\r\n"
        setTimeout(() => {
          client.write(`<c>${connectKey}${lineEnding}<c>/FE:STORMFRONT /VERSION:1.0.1.26 /P:WIN_UNKNOWN /XML${lineEnding}`)
        }, 0)
        setTimeout(() => {
          client.write(`<c>${lineEnding}`)
        }, 50)
        setTimeout(() => {
          client.write(`<c>_STATE CHATMODE OFF${lineEnding}`)
        }, 1000)
        setTimeout(() => {
          client.write(`<c>${lineEnding}`)
        }, 1100)
        // todo: can we await specific text responses before sending this stuff instead of a timeout
      })
      globals.connected = true
      globalUpdated('connected')
    })
  }

  // Helper Functions:

  function sendCommandToGame(commands) {
    commands.split(';').forEach(command => {
      client.write('<c>' + command + '\n')
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

  async function setupNewLogger() {
    // charName = "Anonymous", instance = "UI"
    const charName = 'Anonymous'
    const instance = 'UI'
    // todo: detect change in XML and switch to new logger when char name changes? or have some other global like profile name?
    console.log('makeLogger:', makeLogger)
    const rawLogger = await makeLogger(charName, instance, "raw")
    rawLog = rawLogger.log
    unloadRawLogger = rawLogger.unloadLogger
    const gameLogger = await makeLogger(charName, instance, "game")
    gameLog = gameLogger.log
    unloadGameLogger = gameLogger.unloadLogger
  }

  return { connect, sendCommand }
}

module.exports = game;