# Electron-Dr

After cloning, npm install.

Do not try to run this in Windows Linux Subsystem, it will not work. Mac/Windows/Linux should be fine though.

Note: you will need a username and password saved in a .env file in the root directory of this project, in this format:

ACCOUNT=accountName
PASSWORD=hunter2
INSTANCE=DR
CHARACTER=Zoha

## Todos

- Configure linting settings for project

- Pipe sge server messages to main window

- Support to enter your own account info
  - Support for multiple accounts
  - Protect accounts with master password and encrypt everything locally
  - local account config in new window

- Script system w/ pauses for now
  - make example hunting script to flesh out system

- Links: make links open in new window (login links, for instance)

- Convert FE to React (in progress)
  - https://www.freecodecamp.org/news/building-an-electron-application-with-create-react-app-97945861647c/

- Highlight + something to trigger elanthipedia search

- XML
  - shop verb/window
  - filter this out, and send proper event to client:
  <pushStream id="logons"/> * Rhylaris returns home from a hard day of adventuring.
  <popStream/>

- Non-xml parsing

  - assess (and other windows - need window system)
  - attack parsing
  - info / stat parsing
  - exp command (useful to set vars after #xml reset)

- Better visual for RT display and bodyPosition

- Logging
  - logging currently writing at 1 second interval, but not a true buffer (which would be more performant)
  - be sure to log script errors for debugging
  - possible to write to compressed format on the fly?

- Skinning system (dynamically loading css variables)

  - Think light or dark mode to start

- Dynamically loaded triggers?

- Map system?

  - GraphDB of rooms using ArangoDB?
    - https://www.arangodb.com/docs/stable/drivers/js-getting-started.html
  - Visualization using library (like deckGL but with drag/drop capabilities and non-spherical coordinate system)

- Save description of character on look, store in DB, add ability to recall later

- Ensure prompt time matches system time, or calculate offset

## React DevTools Extension
https://www.electronjs.org/docs/tutorial/devtools-extension

1. Install it in Chrome browser.
2. Navigate to chrome://extensions, and find its extension ID, which is a hash string like fmkadmapgofadopljbjfkapdkoienihi
3. Find out filesystem location used by Chrome for storing extensions:
  - on Windows it is %LOCALAPPDATA%\Google\Chrome\User Data\Default\Extensions;
  - on macOS it is ~/Library/Application Support/Google/Chrome/Default/Extensions
4. Pass the location of the extension to BrowserWindow.addDevToolsExtension API, for the React Developer Tools, it is something like:
  const path = require('path')
  const os = require('os')
  BrowserWindow.addDevToolsExtension(
    path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.3.0_0')
  )

5. Note: The BrowserWindow.addDevToolsExtension API cannot be called before the ready event of the app module is emitted.