const expLookup = {
  "clear": 0,
  "dabbling": 1,
  "perusing": 2,
  "learning": 3,
  "thoughtful": 4,
  "thinking": 5,
  "considering": 6,
  "pondering": 7,
  "ruminating": 8,
  "concentrating": 9,
  "attentive": 10,
  "deliberative": 11,
  "interested": 12,
  "examining": 13,
  "understanding": 14,
  "absorbing": 15,
  "intrigued": 16,
  "scrutinizing": 17,
  "analyzing": 18,
  "studious": 19,
  "focused": 20,
  "very focused": 21,
  "engaged": 22,
  "very engaged": 23,
  "cogitating": 24,
  "fascinated": 25,
  "captivated": 26,
  "engrossed": 27,
  "riveted": 28,
  "very riveted": 29,
  "rapt": 30,
  "very rapt": 31,
  "enthralled": 32,
  "nearly locked": 33,
  "mind lock": 34
}

function setupXMLparser(globals, globalUpdated) {
  console.log('XML version loaded: 8');
  globals.exp = {};
  globals.room = {};
  globals.rightHand = {};
  globals.leftHand = {};
  console.log('globals reset');
  return function parseXML(str) {
    // First, do multi-line parsing (like inventory)

    // Otherwise, check line by line.
    const lines = str.split("\n");
    lines.forEach(line => {
      if (!line.startsWith("<")) return;
      if (line.startsWith("<component id='exp"))
        return parseExp(line, globals, globalUpdated);
      if (line.startsWith("<streamWindow id='room"))
        return parseRoomName(line, globals);
      if (line.startsWith("<component id='room desc"))
        return parseRoomDescription(line, globals);
      if (line.startsWith("<component id='room objs"))
        return parseRoomObjects(line, globals, globalUpdated);
      if (line.startsWith("<component id='room players"))
        return parseRoomPlayers(line, globals, globalUpdated);
      if (line.startsWith("<component id='room exits"))
        return parseRoomExits(line, globals, globalUpdated);
      if (line.startsWith("<left") || line.startsWith("<right"))
        return parseHeldItem(line, globals, globalUpdated);
    });

    // pick up something in a hand. note this actually starts line
    // <left exist="4717291" noun="moss">moss</left><
    // <right exist="4717193" noun="stem">stem</right>
    // for worn items, that gets resent a lot for no reason,
    // I should check the string length and value before parsing out each time

  }
}

function parseHeldItem(line, globals, globalUpdated) {
  const handMatch = line.match(/<(left|right) exist="(\d*)" noun="(\S+)">([^<]*)<\/(left|right)>/);
  if (!handMatch) { // Hand is empty in this case
    const emptyHandMatch = line.match(/<(right|left)>Empty<\/(right|left)>/);
    if (!emptyHandMatch) return;
    const hand = emptyHandMatch[1];
    const handKey = hand === "left" ? "leftHand" : "rightHand";
    globals[handKey] = {
      noun: "",
      id: "",
      item: ""
    };
    return globalUpdated("hand", hand);
  };
  const hand = handMatch[1];
  const itemId = handMatch[2];
  const itemNoun = handMatch[3];
  const itemDescription = handMatch[4];
  const handKey = hand === "left" ? "leftHand" : "rightHand";
  globals[handKey] = {
    noun: itemNoun,
    id: "#" + itemId, // can't reference items without # so might as well include from start
    item: itemDescription
  };
  globalUpdated("hand", hand);
}

function parseRoomName(line, globals) {
  const roomNameMatch = line.match(/<streamWindow id='room' title='Room' subtitle=" - \[([^\]]+)\]"/);
  if (roomNameMatch && roomNameMatch[1]) {
    return globals.room.name = roomNameMatch[1];
  }
}

function parseRoomDescription(line, globals) {
  const roomDescriptionMatch = line.match(/<component id='room desc'>(.*)<\/component>/);
  if (roomDescriptionMatch && roomDescriptionMatch[1]) {
    return globals.room.description = roomDescriptionMatch[1];
  }
}

function parseRoomObjects(line, globals, globalUpdated) {
  if (line === globals.room.objectsString) return; // when would this happen?
  const roomObjsMatch = line.match(/<component id='room objs'>You also see (.+)\.<\/component>/);
  if (!roomObjsMatch) {
    globals.room.objectsArray = [];
    globals.room.objectsString = "";
  } else {
    const objectsArray = stringListToArray(roomObjsMatch[1]);
    globals.room.objectsArray = objectsArray;
    globals.room.objectsString = line;
  }
  globalUpdated("room objects");
}

function parseRoomPlayers(line, globals, globalUpdated) {
  // <component id='room players'>Also here: Eblar.</component>
  const roomPlayersMatch = line.match(/<component id='room players'>(.*)<\/component>/);
  if (!roomPlayersMatch) return;
  if (roomPlayersMatch[1] === "") {
    globals.room.playersString = "";
    globals.room.playersArray = [];
  }
  else {
    globals.room.playersString = roomPlayersMatch[1];
    const playersArray = stringListToArray(roomPlayersMatch[1].replace(/^Also here: /, "").replace(/\.$/, ""));
    globals.room.playersArray = playersArray;
  }
  globalUpdated("room players");
}

function parseRoomExits(line, globals, globalUpdated) {
  const exits = {
    north: false,
    northeast: false,
    east: false,
    southeast: false,
    south: false,
    southwest: false,
    west: false,
    northwest: false,
    up: false,
    down: false,
    out: false,
    array: []
  };
  const portalMatches = line.match(/<d>(\w+)<\/d>/g);
  // portalMatches: [ '<d>east</d>', '<d>west</d>', '<d>east</d>', '<d>west</d>' ]
  const exitArray = [];
  portalMatches.forEach(portalStr => {
    const dirMatch = portalStr.match(/<d>(\w+)<\/d>/);
    if (dirMatch && dirMatch[1]) {
      exits[dirMatch[1]] = true;
      exitArray.push(dirMatch[1]);
    }
  });
  globals.room.exits = exits;
  globals.room.exits.array = exitArray;
  globalUpdated("room");
}

function parseExp(line, globals, globalUpdated) {
  // not sure if exp should fire an updated event per line - might want to display all exp gained in a single line
  let expType = "pulse";
  if (line.includes("whisper")) {
    line = line.replace(/<preset id='whisper'>/, "").replace(/<\/preset>/, "");
    expType = "gain";
  }
  const expMatch = line.match(/<component id='exp ([\w ]+)'>.+:\s+(\d+) (\d\d)% (.+)\s*<\/component>/);
  if (!expMatch) return
  try {
    const skill = formatSkillName(expMatch[1]);
    const rank = parseFloat(expMatch[2] + "." + expMatch[3]);
    const rateWord = expMatch[4].trim();
    const rate = expLookup[rateWord]
    if (!globals.exp[skill]) globals.exp[skill] = {};
    globals.exp[skill].rank = rank;
    globals.exp[skill].rate = rate;
    globalUpdated(expType, skill);
  } catch (err) {
    console.error("Error parsing exp:", err);
  }
}

function formatSkillName(str) {
  // "Medium Edged" returns "mediumEdged"
  return str.substring(0, 1).toLowerCase() + str.substring(1).replace(" ", "");
}

function stringListToArray(str) {
  // todo: special logic for items like ball and chain
  str = str.replace(" and ", ", ");
  return str.split(", ");
}

module.exports = setupXMLparser;