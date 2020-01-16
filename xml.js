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
// fyi, on login we can grab the stow container #code:
// <exposeContainer id='stow'/><container id='stow' title="My Carpetbag" target='#1088134' location='right' save='' resident='true'/><clearContainer id="stow"/><inv id='stow'>In the carpetbag:</inv><inv id='stow'> a rock</inv><inv id='stow'> a rock</inv><inv id='stow'> a rock</inv><inv id='stow'> a map</inv><inv id='stow'> a wood-hilted broadsword</inv><inv id='stow'> a steel pin</inv><inv id='stow'> a rock</inv><openDialog type='dynamic' id='minivitals' title='Stats' location='statBar'><dialogData id='minivitals'></dialogData></openDialog>`

function setupXMLparser(globals, xmlUpdateEvent) {
  // the regex split is too much of a black box, I think I need to go back to my original line-by-line parsing with checks for multi-line xml first
  // the only multi-line stuff I care about is inventory and spells I think
  globals.bodyPosition = ""; // standing, sitting, kneeling, prone
  globals.exp = {};
  globals.room = {
    name: "",
    description: "",
    items: [],
    mobs: [],
    monsterCount: 0,
    exits: {
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
      out: false
    }
  };
  globals.rightHand = {};
  globals.leftHand = {};
  globals.roundTime = 0;
  globals.preparedSpell = "";
  globals.activeSpells = [];
  globals.worn = [];
  globals.stow = {
    container: "",
    items: [],
    uniqueItems: {}
  };
  globals.vitals = {};

  console.log('*** Globals Reset ***');

  return function parseXML(str) {
    // const selfClosingTagRegex = /<(\w+)[^<]*\/>/g;
    const tagRegex = /<([^<\/]+)\/?>/g;
    let m;
    let tagsObj = {};
    console.log("----------------------\n", str);
    do {
      m = tagRegex.exec(str);
      if (m) {
        tagsObj[m[1]] = m[0];
      }
    } while (m);
    // console.log(tagsObj);

    Object.keys(tagsObj).forEach(key => {
      console.log('key:', key);
      const line = tagsObj[key];
      if (key.startsWith("nav")) return fireRoomUpdate(str, globals, xmlUpdateEvent);
      if (key.startsWith("component id='room objs'")) return parseRoomObjects(str, globals, xmlUpdateEvent);
      if (key.startsWith("component id='room players'")) return parseRoomPlayers(str, globals, xmlUpdateEvent);
      if (key.startsWith("roundTime")) return parseRoundtime(line, globals, xmlUpdateEvent);
      if (key.startsWith("pushStream id='inv'")) return parseInventory(str, globals, xmlUpdateEvent);
    });
  }
}



function parseActiveSpells(str, globals, xmlUpdateEvent) {
  // <pushStream id="percWindow"/>Ease Burden  (4 roisaen)
  // Minor Physical Protection  (3 roisaen)
  // <popStream/>You sense the Ease Burden spell upon you, which will last for about four roisaen.
  const spellList = str.replace(/^<pushStream id="percWindow"\/>/, "").replace(/<popStream\/>.*/, "").split("\n").filter(s => s.length);
  // [ 'Ease Burden  (1 roisan)', 'Minor Physical Protection  (Fading)' ]
  globals.activeSpells = spellList; // todo: parse out durations and spells
  xmlUpdateEvent("activeSpells");
}

function parseInventory(str, globals, xmlUpdateEvent) {
  const handMatch = str.match(/<(right|left)([^<]+)<\/(right|left)>/m);
  if (handMatch) {
    parseHeldItem(str, globals, xmlUpdateEvent);
  }
  const wornMatch = str.match(/Your worn items are:\r\n([^<]+)<popStream\/>/);
  if (wornMatch) {
    const items = wornMatch[1].split("\r\n").map(i => i.trim());
    globals.worn = items;
    xmlUpdateEvent("worn");
  }
}

function parseSpellPrep(line, globals, xmlUpdateEvent) {
  if (line.startsWith("<spell>None</spell>")) {
    globals.preparedSpell = "";
    return xmlUpdateEvent("preparedSpell");
  }
  // <spell exist='spell'>Minor Physical Protection</spell>
  const spellMatch = line.match(/<spell exist='spell'>(.*)<\/spell>/);
  if (!spellMatch) return console.error("Unable to parse prepared spell:", line);
  globals.preparedSpell = spellMatch[1];
  xmlUpdateEvent("preparedSpell");
}

function parseVitals(line, globals, xmlUpdateEvent) {
  // <dialogData id='minivitals'><skin id='manaSkin' name='manaBar' controls='mana' left='20%' top='0%' width='20%' height='100%'/><progressBar id='mana' value='99' text='mana 99%' left='20%' customText='t' top='0%' width='20%' height='100%'/></dialogData>
  const vitalsMatch = line.match(/<progressBar id='(\w+)' value='(\d+)'/);
  if (!vitalsMatch) return console.error("Unable to match vitals:", line);
  const vital = vitalsMatch[1];
  const value = parseInt(vitalsMatch[2]);
  globals.vitals[vital] = value;
  xmlUpdateEvent("vitals", vital);
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

function parseHeldItem(str, globals, xmlUpdateEvent) {
  // 3 cases
  // hand is holding item, hand is emptied, hand gets item then empties (passthrough)
  // (which is a str with 2 xml statements)
  const handPassthroughMatch = str.match(/<(left|right) exist="\d+" noun="\S+">[^<]+<\/(left|right)><(left|right)>Empty<\/(left|right)>/);
  if (handPassthroughMatch) return; // no point in firing a change event, hand didn't change essentially

  const handMatch = str.match(/<(left|right) exist="(\d*)" noun="(\S+)">([^<]*)<\/(left|right)>/);
  if (!handMatch) { // Hand is empty in this case
    const emptyHandMatch = str.match(/<(right|left)>Empty<\/(right|left)>/);
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
  // <streamWindow id='room' title='Room' subtitle=" - [Northern Trade Road, Farmlands]" location='center' target='drop' ifClosed='' resident='true'/>
  const roomNameMatch = line.match(/<streamWindow id='room' title='Room' subtitle=" - \[([^\]]+)\]"/);
  if (roomNameMatch && roomNameMatch[1]) {
    globals.room.name = roomNameMatch[1];
    // setTimeout(() => xmlUpdateEvent("room"), 100);
  }
}

function parseRoomDescription(line, globals) {
  console.log("PARSEROOMDESCRTIPSF:", line);
  const roomDescriptionMatch = line.match(/<component id='room desc'>(.*)<\/component>/);
  if (roomDescriptionMatch && roomDescriptionMatch[1]) {
    return globals.room.description = roomDescriptionMatch[1];
  }
}

function fireRoomUpdate(str, globals, xmlUpdateEvent) {
  parseRoomName(str, globals);
  parseRoomDescription(str, globals);
  parseRoomExits(str, globals, xmlUpdateEvent);
  // setTimeout(() => xmlUpdateEvent("room"), 100);
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
  portalMatches.forEach(portalStr => {
    const dirMatch = portalStr.match(/<d>(\w+)<\/d>/);
    if (dirMatch && dirMatch[1]) {
      console.log('dirMatch:', dirMatch[1]);
      exits[dirMatch[1]] = true;
      exits.array.push(dirMatch[1]);
    }
  });
  console.log('exits:', exits)
  globals.room.exits = exits;
  globals.room.test = exits;
  xmlUpdateEvent("room");
}

function parseStowed(line, globals, xmlUpdateEvent) {
  // `<clearContainer id="stow"/><inv id='stow'>In the carpetbag:`,
  // "<inv id='stow'> a rock",
  // ...
  // "<inv id='stow'> a map",
  // 'You put your rock in your leather-clasped carpetbag.'
  // alternately, with nothing in the bag:
  // `<clearContainer id="stow"/><inv id='stow'>In the carpetbag:`,
  // "<inv id='stow'> nothing",
  // 'You get a map from inside your leather-clasped carpetbag.

  const rawItems = line.split("</inv>");
  const containerMatch = rawItems[0].match(/In the (\S+):$/)
  const containerName = containerMatch[1];
  const items = [];
  // note: skipping first and last line here intentionally:
  for (let i = 1; i < rawItems.length - 1; i++) {
    // "<inv id='stow'> a rock"
    const cleanedItem = rawItems[i].match(/> (.+)$/)[1];
    items.push(cleanedItem);
  }
  const uniqueItems = {};
  items.forEach(item => {
    if (!uniqueItems[item]) {
      uniqueItems[item] = 1;
    } else {
      uniqueItems[item] += 1;
    }
  })
  globals.stow.container = containerName;
  globals.stow.items = items;
  globals.stow.uniqueItems = uniqueItems;
  xmlUpdateEvent("stow");
}

function parseExp(line, globals, xmlUpdateEvent) {
  // todo: add additional event for exp parsed rather than each individual skill?
  let expType = "pulse";
  if (line.includes("whisper")) {
    line = line.replace(/<preset id='whisper'>/, "").replace(/<\/preset>/, "");
    expType = "gain";
  }
  const expMatch = line.match(/<component id='exp ([\w ]+)'>.+:\s+(\d+) (\d\d)% (.+)\s*<\/component>/);

  if (!expMatch) {
    // exp pulsing to zero:
    // <component id='exp Outdoorsmanship'></component>
    const clearedExpMatch = line.match(/<component id='exp ([\w ]+)'><\/component>/);
    if (clearedExpMatch) {
      const skill = formatSkillName(clearedExpMatch[1]);
      if (!globals.exp[skill]) globals.exp[skill] = {};
      globals.exp[skill].rate = 0;
      globals.exp[skill].rateWord = "clear";
      xmlUpdateEvent("pulse", skill);
    } else {
      console.error("Error matching exp, not sure what happened.")
    }
  } else {
    try {
      const skill = formatSkillName(expMatch[1]);
      const displayName = expMatch[1]
      const rank = parseFloat(expMatch[2] + "." + expMatch[3]);
      const rateWord = expMatch[4].trim();
      const rate = expLookup[rateWord]
      if (!globals.exp[skill]) globals.exp[skill] = {};
      globals.exp[skill].rank = rank;
      globals.exp[skill].rate = rate;
      globals.exp[skill].displayName = displayName;
      const fullSkillTextMatch = line.match(/<component id='exp [\w ]+'>(.+:\s+\d+ \d\d% .+\s*)<\/component>/);
      if (fullSkillTextMatch) {
        globals.exp[skill].displayStr = fullSkillTextMatch[1];
      }
      xmlUpdateEvent(expType, skill);
    } catch (err) {
      console.error("Error parsing exp:", err);
    }
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