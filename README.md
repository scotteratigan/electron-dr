# Electron-Dr

## Installation

- `npm install`
- `cd react-client`
- `npm install`
- `cd ..`
- `npm run start-all`

Do not try to run this in Windows Linux Subsystem, it will not work. Mac/Windows/Linux should be fine though.

- Login:
  -Add account with username, password. If valid, automatically downloads characters for all instances.
  -With saved account, user can connect through the account modal using drop-downs to select account, instance, character
  -after auth info is saved, user can connect with #connect drf charname

## Todos

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


