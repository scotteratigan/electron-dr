// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const { ipcMain } = require('electron') // to talk to the browser window
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let game
let sendCommand
let hardWired = false
// const isMac = process.platform === 'darwin'

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // necessary to get icpMain import in the window
    },
  })
  mainWindow.webContents.on('did-finish-load', () => {
    // What should I do on load?
  })

  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'Connect', click: () => messageFrontEnd({type: 'openConnectModal'})},
        // { label: 'Play', click: () => hardWire() }, // todo: allow this to open connect modal
        // { role: isMac ? 'close' : 'quit' }
        { role: 'quit' },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          },
        },
        {
          label: 'Dev Tools',
          role: 'toggleDevTools',
        },
        {
          label: 'Force Reload',
          role: 'forceReload',
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // and load the index.html of the app.
  // mainWindow.loadFile('client/index.html')
  // mainWindow.loadFile('react-client/index.html')
  mainWindow.loadURL('http://localhost:3000');

  // make it big:
  mainWindow.maximize()

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // todo: send exit command if connected?
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  loadDevTools()
})

function loadDevTools() {
  // note: only needs to be loaded once but doesn't hurt to attempt each time
  // for dev mode only
  BrowserWindow.addDevToolsExtension(
    path.join(__dirname, 'react-devtools-4.4.0_3')
  )
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (!isMac) app.quit()
  // todo: quit game first?
  app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function hardWire(commandText) {
  const gamePath = path.join(__dirname, "game.js")
  delete require.cache[gamePath];
  game = require("./game.js");
  const gameReturns = game(messageFrontEnd)
  sendCommand = gameReturns.sendCommand;
}

function messageFrontEnd(message) {
  mainWindow.webContents.send('message', message)
}

// todo: can we just hardwire at startup?
ipcMain.on('asynchronous-message', (event, command) => {
  if (!hardWired) {
    hardWired = true
    hardWire()
  }
  sendCommand(command); // (Command received from player, pass on to game)
})