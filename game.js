'use strict'
require('dotenv').config()
const net = require('net')
const { parentPort: frontEnd } = require('worker_threads')
const client = new net.Socket()
const getConnectKey = require('./sge')
const makeLogger = require('./log')

// no need for export, this will be executed via worker thread

// Initialization Stuff:
const globals = {}
let parseXML = () => {}
let parseText = () => {} // used by script. todo: add parsexmlchange to trigger off of xml?
let filterXML = () => {}
let log = defaultLogFn
let unloadLogger = () => {}
loadXMLparser() // loads or re-loads the parseXML function
setupNewLogger()

// Actions / Runtime:

// Message from client:
frontEnd.on('message', async command => {
  // async only for script loading - need to revisit later
  if (command.startsWith('.')) {
    console.log('prepare to launch script!')
    const scriptImport = require('./loadScript') // this needs to be reworked
    const { loadScript } = scriptImport
    return (sendParseText = await loadScript(
      'script',
      sendCommandToGame,
      globals
    ))
  }
  if (command.startsWith('#log ')) {
    const logText = command.substring(4) // strips out '#log '
    try {
      log(logText)
    } catch (err) {
      console.error(`Unable to log text "${logText}"`)
    }
    return
  }
  if (command.startsWith('#xml')) {
    frontEnd.postMessage({
      type: 'gametext',
      detail: '*** Reloading XML Parser. ***',
    })
    return loadXMLparser()
  }
  if (command.startsWith('#var')) {
    return frontEnd.postMessage({ type: 'globals', globals })
  }
  if (command.startsWith('#')) {
    return frontEnd.postMessage({
      type: 'gametext',
      detail: 'Unknown command:' + command,
    })
  }
  sendCommandToGame(command)
})
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
    if (nonXMLtext)
      frontEnd.postMessage({ type: 'gametext', detail: nonXMLtext })
  } catch (err) {
    console.error('Uncaught error parsing xml:', err)
  }
  try {
    log(gameStr)
  } catch (err) {
    console.error('Unable to log to file:', err)
  }
})

client.on('close', function() {
  console.log('Connection closed.')
  frontEnd.postMessage({ type: 'gametext', detail: 'Connection closed.' })
  log('Connection closed.')
  unloadLogger()
  process.exit(0)
})

client.on('error', function(error) {
  console.error('Connection lost?:', error)
  frontEnd.postMessage({
    type: 'gametext',
    detail: 'Connection lost: ' + error.code,
  })
  // todo: fire global change to client (perhaps change color?)
  process.exit(0)
})

// Actual Connect process:

getConnectKey((connectKey, ip, port) => {
  console.log('Received connect key:', connectKey)
  client.connect(port, ip, function() {
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
})

// Helper Functions:

function sendCommandToGame(commands) {
  commands.split(';').forEach(command => {
    client.write(command + '\n')
    console.log('COMMAND: ' + command)
  })
}

function globalUpdated(global, detail = '') {
  // Forwards along the event and detail (hand or exp only for now) along with all global values:
  frontEnd.postMessage({ type: global, detail, globals })
}

function loadXMLparser() {
  parseXML = () => {}
  filterXML = () => {}
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
