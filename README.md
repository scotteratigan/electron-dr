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
- Is there a way to streamline login? what does SF client do differently? What message does it wait for?

- Support to enter your own account info
- Support for multiple accounts

- Logging

  - use non-xml logger in tandem
  - be sure to log script errors for debugging

- Script system w/ pauses for now

  - loaded via worker thread
  - access to xml events, globals, and game text

- Links: make links open in new window (login links, for instance)

- Non-xml parsing

  - assess (and other windows)
  - attack parsing
  - info / stat parsing
  - exp command (useful to set vars after #xml reset)

- Better visual for RT display and bodyPosition

- Skinning system (dynamically loading css variables)

  - Think light or dark mode to start

- Dynamically loaded triggers?

- Map system?

  - GraphDB of rooms using ArangoDB?
    - https://www.arangodb.com/docs/stable/drivers/js-getting-started.html
  - Visualization using library (like deckGL but with drag/drop capabilities and non-spherical coordinate system)

- Save description of character on look, store in DB, add ability to recall later

- Ensure prompt time matches system time, or calculate offset
