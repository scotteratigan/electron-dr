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
// Alchemy
// Appraisal
// Arcana
// Athletics
// Attunement
// Augmentation
// Bow
// Brawling
// Brigandine
// Chain Armor
// Crossbow
// Debilitation
// Defending
// Enchanting
// Engineering
// Evasion
// First Aid
// Forging
// Heavy Thrown
// Holy Magic
// Large Blunt
// Large Edged
// Light Armor
// Light Thrown
// Locksmithing
// Mechanical Lore
// Melee Mastery
// Missile Mastery
// Offhand Weapon
// Outdoorsmanship
// Outfitting
// Parry Ability
// Perception
// Performance
// Plate Armor
// Polearms
// Scholarship
// Shield Usage
// Skinning
// Slings
// Small Blunt
// Small Edged
// Sorcery
// Staves
// Stealth
// Tactics
// Targeted Magic
// Theurgy
// Thievery
// Twohanded Blunt
// Twohanded Edged
// Utility
// Warding

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
  globals.gameTime = 0;

  console.log('*** Globals Reset ***');

  return function parseXML(str) {
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

    Object.keys(tagsObj).forEach(key => {
      console.log('key:', key);
      const line = tagsObj[key];
      // self-closing tags can use line, paired tags or multi-line tags need to use str
      if (key.startsWith("nav")) return fireRoomUpdate(str, globals, xmlUpdateEvent);
      if (key.startsWith("component id='room objs'")) return parseRoomObjects(str, globals, xmlUpdateEvent);
      if (key.startsWith("component id='room players'")) return parseRoomPlayers(str, globals, xmlUpdateEvent);
      if (key.startsWith("roundTime")) return parseRoundtime(line, globals, xmlUpdateEvent);
      if (key.startsWith("pushStream id='inv'")) return parseInventory(str, globals, xmlUpdateEvent);
      if (key.startsWith("pushStream id=\"percWindow")) return parseActiveSpells(str, globals, xmlUpdateEvent);
      if (key.startsWith("component id='exp")) return parseExp(str, globals, xmlUpdateEvent);
      if (key.startsWith("indicator")) return parseBodyPosition(str, globals, xmlUpdateEvent);
      if (key.startsWith("progressBar")) return parseVital(line, globals, xmlUpdateEvent);
      if (key.startsWith("prompt time")) return parseGameTime(line, globals, xmlUpdateEvent);
      if (key === "inv id='stow'") return parseStowed(str, globals, xmlUpdateEvent);
      if (key === "spell") return clearPreparedSpell(globals, xmlUpdateEvent);
      if (key === "spell exist='spell'") return parseSpellPrep(str, globals, xmlUpdateEvent);
    });
  }
}

function parseGameTime(line, globals, xmlUpdateEvent) {
  const gameTimeMatch = line.match(/<prompt time="(\d+)">/);
  if (!gameTimeMatch) return console.error("Error matching game time:", line);
  const gameTime = parseInt(gameTimeMatch[1]);
  globals.gameTime = gameTime;
  xmlUpdateEvent("gametime");
}

function parseVital(line, globals, xmlUpdateEvent) {
  const vitalsMatch = line.match(/<progressBar id='(\w+)' value='(\d+)'/);
  if (!vitalsMatch) return console.error("Unable to match vitals:", line);
  const vital = vitalsMatch[1];
  const value = parseInt(vitalsMatch[2]);
  globals.vitals[vital] = value;
  xmlUpdateEvent("vitals", vital);
}

function clearPreparedSpell(globals, xmlUpdateEvent) {
  globals.preparedSpell = "";
  xmlUpdateEvent("preparedSpell");
}

function parseActiveSpells(str, globals, xmlUpdateEvent) {
  const spellMatch = str.match(/<pushStream id="percWindow"\/>([^<]+)\r\n<popStream\/>/);
  // 'Minor Physical Protection  (10 roisaen)\r\nEase Burden  (7 roisaen)'
  if (!spellMatch) return console.error("Unknown error matching active spells");
  // [ 'Ease Burden  (1 roisan)', 'Minor Physical Protection  (Fading)' ]
  const spellList = spellMatch[1].split("\r\n");
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

function parseSpellPrep(str, globals, xmlUpdateEvent) {
  // <spell exist='spell'>Minor Physical Protection</spell>
  const spellMatch = str.match(/<spell exist='spell'>(.*)<\/spell>/);
  if (!spellMatch) return console.error("Unable to parse prepared spell:", str);
  globals.preparedSpell = spellMatch[1];
  xmlUpdateEvent("preparedSpell");
}

function parseBodyPosition(str, globals, xmlUpdateEvent) {
  // <indicator id="IconKNEELING" visible="y"/><indicator id="IconPRONE" visible="n"/><indicator id="IconSITTING" visible="n"/>
  const bodyPositionMatch = str.match(/<indicator.+id="Icon(\w+)" visible="y"/);
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
  portalMatches && portalMatches.forEach(portalStr => {
    const dirMatch = portalStr.match(/<d>(\w+)<\/d>/);
    if (dirMatch && dirMatch[1]) {
      console.log('dirMatch:', dirMatch[1]);
      exits[dirMatch[1]] = true;
      exits.array.push(dirMatch[1]);
    }
  });
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

function parseExp(str, globals, xmlUpdateEvent) {
  // console.log('PARSEEXP', str);
  // <component id='exp Outdoorsmanship'><preset id='whisper'> Outdoorsmanship:    4 19% dabbling     </preset></component>
  // <component id='exp Perception'><preset id='whisper'>      Perception:    5 85% dabbling     </preset></component>
  // <roundTime value='1579154336'/>You wander around and poke your fingers into a few places, wondering what you might find.
  // Roundtime: 5 sec.
  // <component id='room objs'></component>
  // <prompt time="1579154331">&gt;</prompt>
  const skillRegex = /<component id='exp ([^']+)'>[^\d]+(\d+) (\d\d)% (\w+|\w+ \w+)\s+</g;
  let m;
  console.log("----------------------\n", str);
  do {
    m = skillRegex.exec(str);
    if (m) {
      // console.log("---:", m);
      const displayName = m[1]
      const skill = formatSkillName(displayName);
      const rank = parseFloat(m[2] + "." + m[3]);
      const rateWord = m[4];
      const rate = expLookup[rateWord];
      const displayStr = `${displayName.padStart(16, " ")}: ${(m[2] + "." + m[3]).padStart(7, " ")}% ${rate.toString().padStart(2, " ")}/34`
      globals.exp[skill] = {
        rank,
        rate,
        rateWord,
        displayName,
        displayStr
      }
    }
  } while (m);
  xmlUpdateEvent("experience");
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