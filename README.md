# Electron-Dr

After cloning, npm install.

Do not try to run this in Windows Linux Subsystem, it will not work. Mac/Windows/Linux should be fine though.

Note: you will need a username and password saved in a .env file in the root directory of this project, in this format:

ACCOUNT=accountName
PASSWORD=hunter2
INSTANCE=DR
CHARACTER=Zoha

## Todos

- Pipe sge server messages to main window
- Is there a way to streamline login? what does SF client do differently? What message does it wait for?

- title bar replacement (since it can't be skinned)
  - is this worthwhile? it would ruin the native look

- Further xml work
  - experience
  - magic
  - worn inventory
  - stowed inventory
  - store list

- Basic script system w/ pauses for now

- Logging
- Game Text
- XML changes?
- Script error debug?

- Support to enter your own account info
- Support for multiple accounts

- Non-xml parsing
  - assess
  - attack parsing
  - info / stat parsing
  - exp command (useful to set vars at login)

- Better visual for RT display and bodyPosition

- Skinning system (dynamically loading css variables)
  - Think light or dark mode to start

- Dynamically loaded triggers?

- Map system?

- Ensure prompt time matches system time, or calculate offset

New idea for xml parsing
go back to line-by-line system, except for special xml