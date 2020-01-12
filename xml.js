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

let rtInterval = null;

function setupXMLparser(globals, xmlUpdateEvent) {
  console.log('XML version loaded: 8');
  globals.exp = {};
  globals.room = {};
  globals.rightHand = {};
  globals.leftHand = {};
  globals.roundTime = 0;
  // I don't like the idea of 5 variables to track this:
  globals.bodyPosition = ""; // standing, sitting, kneeling, prone
  console.log('globals reset');
  return function parseXML(str) {
    // First, do multi-line parsing (like inventory)

    // Otherwise, check line by line.
    const lines = str.split("\n");
    lines.forEach(line => {
      if (!line.startsWith("<")) return;
      if (line.startsWith("<component id='exp"))
        return parseExp(line, globals, xmlUpdateEvent);
      if (line.startsWith("<streamWindow id='room"))
        return parseRoomName(line, globals);
      if (line.startsWith("<component id='room desc"))
        return parseRoomDescription(line, globals);
      if (line.startsWith("<component id='room objs"))
        return parseRoomObjects(line, globals, xmlUpdateEvent);
      if (line.startsWith("<component id='room players"))
        return parseRoomPlayers(line, globals, xmlUpdateEvent);
      if (line.startsWith("<component id='room exits"))
        return parseRoomExits(line, globals, xmlUpdateEvent);
      if (line.startsWith("<left") || line.startsWith("<right"))
        return parseHeldItem(line, globals, xmlUpdateEvent);
      if (line.startsWith("<roundTime"))
        return parseRoundtime(line, globals, xmlUpdateEvent);
      if (line.startsWith("<indicator"))
        return parseBodyPosition(line, globals, xmlUpdateEvent);
    });

    // pick up something in a hand. note this actually starts line
    // <left exist="4717291" noun="moss">moss</left><
    // <right exist="4717193" noun="stem">stem</right>
    // for worn items, that gets resent a lot for no reason,
    // I should check the string length and value before parsing out each time

  }
}

function parseBodyPosition(line, globals, xmlUpdateEvent) {
  // <indicator id="IconKNEELING" visible="y"/><indicator id="IconPRONE" visible="n"/><indicator id="IconSITTING" visible="n"/>
  const bodyPositionMatch = line.match(/<indicator.+id="Icon(\w+)" visible="y"/);
  if (!bodyPositionMatch) return console.error('Unable to determine verticality.')
  const bodyPosition = bodyPositionMatch[1].toLowerCase();
  globals.bodyPosition = bodyPosition;
  xmlUpdateEvent("bodyPosition");
}

function parseRoundtime(line, globals, xmlUpdateEvent) {
  const rtMatch = line.match(/<roundTime value='(\d+)'\/>/);
  if (!rtMatch) return console.error('Unable to match RT:', line);
  const rtEnds = parseInt(rtMatch[1]);
  countdownRT(rtEnds, globals, xmlUpdateEvent);
}

function countdownRT(rtEnds, globals, xmlUpdateEvent) {
  const rtEndTime = new Date(rtEnds * 1000);
  const currentTime = new Date();
  currentTime.setMilliseconds(0);
  const roundTime = (rtEndTime.getTime() - currentTime.getTime()) / 1000;
  globals.roundTime = roundTime;
  xmlUpdateEvent("roundTime");
  clearInterval(rtInterval); // don't want 2 at once
  rtInterval = setInterval(() => {
    globals.roundTime -= 1;
    xmlUpdateEvent("roundTime");
    if (globals.roundTime <= 0) {
      clearInterval(rtInterval);
    }
  }, 1000)
}

function parseHeldItem(line, globals, xmlUpdateEvent) {
  // 3 cases
  // hand is holding item, hand is emptied, hand gets item then empties (passthrough)
  // (which is a line with 2 xml statements)

  const handPassthroughMatch = line.match(/<(left|right) exist="\d+" noun="\S+">[^<]+<\/(left|right)><(left|right)>Empty<\/(left|right)>/);
  if (handPassthroughMatch) return; // no point in firing a change event, hand didn't change essentially

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
    return xmlUpdateEvent("hand", hand);
  }
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
  xmlUpdateEvent("hand", hand);
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

function parseRoomObjects(line, globals, xmlUpdateEvent) {
  const roomObjsMatch = line.match(/<component id='room objs'>You also see (.+)\.<\/component>/);
  if (!roomObjsMatch) {
    globals.room.items = [];
    globals.room.mobs = [];
    globals.room.monsterCount = 0;
  } else {
    const objectsArray = stringListToArray(roomObjsMatch[1]);
    const items = [];
    const mobs = [];
    objectsArray.forEach(object => {
      if (object.startsWith("<pushBold/>")) {
        mobs.push(object.replace(/<pushBold\/>(.*)<popBold\/>/, "$1"));
      } else items.push(object);
    });
    console.log('items:', items);
    console.log('mobs:', mobs);
    globals.room.items = items;
    globals.room.mobs = mobs;
    globals.room.monsterCount = mobs.length;
  }
  xmlUpdateEvent("room objects");
}

function parseRoomPlayers(line, globals, xmlUpdateEvent) {
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
  xmlUpdateEvent("room players");
}

function parseRoomExits(line, globals, xmlUpdateEvent) {
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
  xmlUpdateEvent("room");
}

function parseExp(line, globals, xmlUpdateEvent) {
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
    xmlUpdateEvent(expType, skill);
  } catch (err) {
    console.error("Error parsing exp:", err);
  }
}

function formatSkillName(str) {
  // "Medium Edged" returns "mediumEdged"
  return str.substring(0, 1).toLowerCase() + str.substring(1).replace(" ", "");
}

function stringListToArray(str) {
  // only match up to 5 words after " and " to help misfires on "a strong and stately mature oak" (TGSE)
  // will still break if this is last item in room
  str = str.replace(/ and (\S+\s?\S*\s?\S*\s?\S*\s?\S*)$/, ", $1");
  return str.split(", ");
}

module.exports = setupXMLparser;