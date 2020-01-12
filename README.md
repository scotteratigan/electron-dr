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

- Further xml work
  - roundtime
  - kneeling / prone / standing indicator
  - worn inventory
  - stowed inventory
  - store list

- Basic script system w/ pauses for now

- Support to enter your own account info
- Support for multiple accounts

- Non-xml parsing
  - assess
  - attack parsing
  - info / stat parsing
  - exp command (useful to set vars at login)

- Skinning system (dynamically loading css variables)
  - Think light or dark mode to start

- Dynamically loaded triggers?

- Map system?

Roundtime notes:
using global RT
2 variables, one to track time when rt expires
other to track current remaining roundtime
roundtimeEnds
roundtime

in addition, there's current game time
<prompt time="1578855547">

- Ensure prompt time matches system time, or calculate offset