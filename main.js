// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const { Worker } = require("worker_threads"); // to run game server
const { ipcMain } = require('electron'); // to talk to the browser window
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow



function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // needed to get icpMain import in the window
    },

  });
  mainWindow.webContents.on('did-finish-load', () => {
    // What should I do on load?
  })

  const isMac = process.platform === 'darwin'
  const template = [
    {
      label: 'File',
      submenu: [
        { label: "Play", click: () => hardWire() },
        { role: isMac ? 'close' : 'quit' },
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        },
        {
          label: "Dev Tools",
          role: "toggleDevTools"
        },
        {
          label: "Force Reload",
          role: "forceReload"
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  mainWindow.loadFile('client/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function hardWire() {
  {
    const game = new Worker("./game.js", {});
    game.on("message", message => {
      // Text received from game.
      // console.log('main.js:', message.value);
      mainWindow.webContents.send('gametext', message);
      // todo: figure out how to send to main window
    });
    ipcMain.on("asynchronous-message", (event, command) => {
      // Command received from Player
      // if (command.startsWith(".")) {
      //   console.log('prepare to launch script!');
      //   return;
      // }
      // console.log(command);
      game.postMessage(command);
    })
  }
}

// hacky, do not like...
ipcMain.on('asynchronous-message', (event, command) => {
  if (command.startsWith("#connect")) hardWire();
})