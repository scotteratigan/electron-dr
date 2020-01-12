# Electron-Dr

After cloning, npm install.

Do not try to run this in Windows Linux Subsystem, it will not work. Mac/Windows/Linux should be fine though.

Note: you will need a username and password saved in a .env file in the root directory of this project, in this format:

ACCOUNT=accountName
PASSWORD=hunter2
INSTANCE=DR
CHARACTER=Zoha

## Todos

- Further xml work
  - complete room stuff (players, object)
  - hands
  - roundtime
  - worn inventory
  - stowed inventory
  - store list

- Basic script system w/ pauses for now

- Support to enter your own account info
- SUpport for multiple accounts



- Non-xml parsing
  - assess
  - attack parsing
  - info / stat parsing
  - exp command (useful to set vars at login)

- Skinning system (dynamically loading css variables)
  - Think light or dark mode to start

- Dynamically loaded triggers?

- Redo archtecture so that 'game' component simply passes messages and any logic can be dynamically reloaded (similar to how xml parsing is implemented) (maybe not needed?)

- Map system?