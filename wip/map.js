// const { v4: uuid } = require('uuid'); // not detecting the export correctly, this mjs stuff is a mess...

const { v4 } = require('./node_modules/uuid/dist/index')

function makeRoom() {
  // creates a new node
}

function makeConnection({originUUID, destinationUUID = null, command, compassDirection, rt = false}) {
  // connects two rooms
  // if makeConnection takes us to unknown room, invoke makeRoom
}

function addDataToRoom(roomUUID, key, value) {
  // adds arbitrary data to a room
  // notes, mana, forageable, mineable, lumberjackable, noviolence, no magic, etc
}

function getRoomData(roomUUID) {
  // returns room data if room exists in db, otherwise no data
}

// keys in map are roomids
const map = {
  '62209c73-3295-461e-ad00-70e84fb43010' : {
    roomid: '62209c73-3295-461e-ad00-70e84fb43010',
    portals: [
      {
        command: 'get lost',
        destination: '62209c73-3295-461e-ad00-70e84fb43010'
      },
      {
        command: 'east',
        destination: '71b86fa3-e9d8-48f8-b7aa-55702da7d5f3'
      }
    ]
  },
  '71b86fa3-e9d8-48f8-b7aa-55702da7d5f3': {
    roomid: '71b86fa3-e9d8-48f8-b7aa-55702da7d5f3',
    portals: [
      {
        command: 'northeast',
        destination: '367072d6-2277-4fee-918b-76d864a10483'
      },
      {
        command: 'southwest',
        destination: '62209c73-3295-461e-ad00-70e84fb43010'
      }
    ]
  },
  '367072d6-2277-4fee-918b-76d864a10483': {
    roomid: '367072d6-2277-4fee-918b-76d864a10483',
    portals: [
      {
        command: 'north',
        destination: null
      },
      {
        command: 'south',
        destination: '71b86fa3-e9d8-48f8-b7aa-55702da7d5f3'
      },
    ]
  },
}

console.log('...and the path is...')
console.log(getPath('62209c73-3295-461e-ad00-70e84fb43010', '367072d6-2277-4fee-918b-76d864a10483'))

function getPath(origin, destination, path = []) {
  // attempts to get a path between two rooms
  // todo: figure out how to get shortest path...
  // recursive function to find path
  // base case: current room is destination
  if (origin === destination) {
    return path
  }

  // recursive case: check all portals
  // for each portal, call getPath, as long as we haven't been to that room before
  const currentRoomId = map[origin].roomid
  for (const portal of map[origin].portals) {
    // special case: current room was already visited in path exploration
    //   this is important so we don't walk in a circle forever
    //   check that destination has not already been visited in path here:
    const roomAlreadyVisited = path.some(direction => direction.roomid === currentRoomId)
    if (!roomAlreadyVisited) {
      const newPath = getPath(portal.destination, destination, path.concat({command: portal.command, roomid: currentRoomId}))
      if (newPath.length) {
        return newPath
      }
    }
  }
  // dead end: no path found in this direction (common)
  return []
}




// All data here is arbitrary, trying to work through the model here

const portal = {
  compassDir: 'north',
  command: 'north',
  destination: '2'
}

const portal2 = {
  compassDir: 'east',
  command: 'go gate',
  destination: '1',
  restrictions: {
    guild: 'Ranger',
    paid: true // paid means not f2p? what about vouchers?
  }
}

const portal3 = {
  compassDir: 'up',
  command: 'climb wall',
  destination: '5',
  restrictions: {
    climbing: 60,
    premium: true
  }
}

const portal4 = {
  compassDir: 'east',
  command: 'east',
  destination: '6',
  restrictions: {
    swimming: 60
  },
  rt: true
}

const room = {
  roomid: '1',
  title: 'The Crossing, Bank Street',
  description: `The Moneylender's commands a breathtaking view of the River Oxenwaithe and its aquatic commerce flowing south towards the mighty Segoltha River and thence eastward to the sea.  From its top-floor windows the bankers can keep watch over the Traders' Guild to the west, and can view the low sprawling warehouses and docks to the south.  Directly across the river is a curious dwelling with a glass gazebo atop it.  You also see the Zoluren Alchemy Society Building and a well-used road leading to the Engineering Society Depot.`,
  portals: [
    {
      compassDir: 'east',
      command: 'east',
      destination: '2'
    },
    {
      compassDir: 'west',
      command: 'west',
      destination: '3'
    },
    {
      compassDir: 'north',
      command: 'go society building',
      destination: '4'
    },
    {
      compassDir: 'northeast',
      command: 'go depot',
      destination: ''
    }
  ]
}

