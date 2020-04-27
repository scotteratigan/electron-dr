# Electron-Dr

## Installation

- `npm install`
- `cd react-client`
- `npm install`
- `cd ..`
- `npm run start-all`

Do not try to run this in Windows Linux Subsystem, it will not work. Mac/Windows/Linux should be fine though.

## Todos

- Support to enter your own account info
  - Save account info
  - Support for multiple accounts
  - Protect accounts with master password and encrypt everything locally
  - local account config in new window

- Auth flow:
  -Add account with username, password. Once complete, run authentication of account to verify validity.
  -Once account added, get games list (instance), save it, and allow user to select instance.
  -Once instance/game is selected, load characters
  -once character is selected, user can choose to connect
  -after auth info is saved, in the future user can connect with #connect drf charname

- Highlights system
  - highlights dynamically applied so new highlights can be used on previous game text (should not be an issue)
  - regex highlights w/ validity check
  - test mode can show highlights applied to text in real-time
  - saved to config file

- Configure linting settings for project

- Pipe sge server messages to main window

- Script system w/ pauses for now
  - make example hunting script to flesh out system

- Links: make links open in new window (login links, for instance)

- Highlight + something action to trigger elanthipedia search

- Ensure prompt time matches system time, or calculate offset

- Multi-line command input
  - input area is taller, enter key does newline, ctrl-enter sends command
  - eventually allows quick composing of mini-scripts

- Parse text input
  - sends raw text to game for parsing, can include xml, etc
  - useful for testing

- XML
  - shop verb/window
  - filter this out, and send proper event to client:
  <pushStream id="logons"/> * Rhylaris returns home from a hard day of adventuring.
  <popStream/>

- Non-xml parsing
  - exp command (useful to set vars after #xml reset)
  - assess (and other windows - need window system)
  - attack parsing
  - info / stat parsing

- Better visual for RT display and bodyPosition

- Logging
  - logging currently writing at 1 second interval, but not a true buffer (which would be more performant)
  - log all errors for debugging
  - possible to write to compressed format on the fly? (not very important)

- Skinning system (dynamically loading css variables)

  - Think light or dark mode to start

- Dynamically loaded triggers?

- Map system?

  - GraphDB of rooms using ArangoDB?
    - https://www.arangodb.com/docs/stable/drivers/js-getting-started.html
  - Visualization using library (like deckGL but with drag/drop capabilities and non-spherical coordinate system)


