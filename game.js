'use strict'
const net = require('net')
const client = new net.Socket()
const { sgeValidate } = require('./sge')
const makeLogger = require('./log')
const { addOrUpdateAccount, removeAccount, loadAccounts, loadSavedCharacters } = require('./save-config')
const { shell } = require('electron')
const scriptRunner = require('./loadscript')

function game(messageFrontEnd) {
  // Initialization Stuff:
  const globals = {}
  // todo: add running scripts to globals?
  let parseXML = () => { }
  let filterXML = () => { }
  let rawLog = () => { }
  let gameLog = () => { }
  let unloadRawLogger = () => { }
  let unloadGameLogger = () => { }
  loadXMLparser() // loads or re-loads the parseXML function
  setupNewLogger()
  const sendScriptEvent = scriptRunner(sendCommand)

  // Actions / Runtime:

  async function sendCommand(command) {
    if (command.startsWith('.')) {
      sendScriptEvent('command', command, globals)
      return
    } else if (command.startsWith("#script")) {
      sendScriptEvent('command', command)
    } else if (command.startsWith("#echo ")) {
      const detail = command.substring(6);
      // if (!detail) return console.error("Echo called with no text?")
      return messageFrontEnd({ type: 'gametext', detail })
    } else if (command.startsWith('#log ')) {
      const logText = command.substring(4) // strips out '#log '
      try {
        console.log('attempting to log...')
        gameLog(logText)
        rawLog(logText)
      } catch (err) {
        console.error(`Unable to log text "${logText}"`)
      }
      return
    } else if (command.startsWith('#xml')) {
      messageFrontEnd({
        type: 'gametext',
        detail: '*** Reloading XML Parser. ***',
      })
      return loadXMLparser()
    } else if (command.startsWith('#var')) {
      return messageFrontEnd({ type: 'globals', globals })
    } else if (command.startsWith('#addOrUpdateAccount')) {
      const accountName = command.split(' ')[1]
      addOrUpdateAccount(accountName)
    } else if (command.startsWith('#loadAccounts')) {
      const accounts = await loadAccounts()
      messageFrontEnd({ type: 'loadAccounts', detail: accounts })
    } else if (command.startsWith('#loadCharacters')) {
      const characters = await loadSavedCharacters()
      messageFrontEnd({ type: 'loadCharacters', detail: characters })
    } else if (command.startsWith('#url')) { // todo: should we just detect urls without the prefix?
      let url = command.substring(5)
      if (!url.startsWith('http')) url = 'https://' + url
      shell.openExternal(url)
    } else if (command.startsWith('#validateAccount')) {
      const [_, account, password] = command.split(' ')
      console.log('attempting to validate account')
      console.log(account)
      console.log(password)
      const res = await addOrUpdateAccount(account, password)
      console.log('res:', res)
    } else if (command.startsWith('#connect')) {
      const [_, account, instance, characterName] = command.split(' ')
      console.log('calling connect with:', {account, instance, characterName})
      connect({account, instance, characterName})
    } else if (command.startsWith('#')) {
      return messageFrontEnd({
        type: 'gametext',
        detail: 'Unknown command:' + command,
      })
    } else {
      sendCommandToGame(command)
    }
  }

  let buffer = []

  client.on('drain', () => {
    console.log('drained...')
  })

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
      if (!nonXMLtext) {
        return
      }
      messageFrontEnd({ type: 'gametext', detail: nonXMLtext })
      gameLog(nonXMLtext)
      sendScriptEvent('text', nonXMLtext)
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

  async function connect({ account, instance, characterName }) {
    console.log('connect received:', account, instance, characterName)
    // todo: detect failure here
    const res = await sgeValidate({ account, gameCode: instance, characterName, messageFrontEnd })
    console.log('sgeRes:', res)
    const { connectKey, connectIP, connectPort } = res
    client.connect(connectPort, connectIP, function () {
      client.setNoDelay(true) // may help with packet buffering
      console.log('Connected, sending key.'.green)
      const lineEnding = "\r\n"
      setTimeout(() => {
        client.write(`<c>${connectKey}${lineEnding}<c>/FE:STORMFRONT /VERSION:1.0.1.26 /P:WIN_UNKNOWN /XML${lineEnding}`)
      }, 0)
      setTimeout(() => {
        client.write(`<c>${lineEnding}`)
      }, 50)
      setTimeout(() => {
        client.write(`<c>_STATE CHATMODE OFF${lineEnding}`) // just to emulate SF? can we skip?
      }, 1000)
      setTimeout(() => {
        client.write(`<c>${lineEnding}`)
      }, 1100)
      setTimeout(() => {
        globals.connected = true
        globalUpdated('connected')
      }, 1500)
      // todo: can we await specific text responses before sending this stuff instead of a timeout?
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
    messageFrontEnd({ type: global, detail, globals })
    sendScriptEvent('xml', global, globals)
    // sendXMLeventToScript(global, detail, globals)
    // runningScriptArr.forEach(script => {
    //   script.parseXML(global, globals)
    // })
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