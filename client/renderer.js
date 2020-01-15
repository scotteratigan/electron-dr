// No Node.js APIs are available in this process because `nodeIntegration` is turned off.
// Use `preload.js` to selectively enable features needed in the rendering process.

const { ipcRenderer } = require('electron');

let cmdHistory = {
  0: ""
};
let cmdIndex = 1;
let cmdLookupIndex = 1;
const maxCmdHistory = 50;
const minLengthCmdToSave = 2;

const commandInput = document.getElementById("commands");
const gameText = document.getElementById("game");
const compassContainer = document.getElementById("compass-container");
const rightHandDisplay = document.getElementById("right-hand");
const leftHandDisplay = document.getElementById("left-hand");
const roundtimeDisplay = document.getElementById("roundtime");
const bodyPositionDisplay = document.getElementById("body-position");
const preparedSpellDisplay = document.getElementById("prepared-spell");
const spellsDisplay = document.getElementById("active-spells");
const wornItemsDisplay = document.getElementById("worn-items");
const stowItemsDisplay = document.getElementById("stowed-items");
const stowItemContainerDisplay = document.getElementById("stow-inventory-header");
const experienceDisplay = document.getElementById("experience");

const vitalElms = {
  health: document.getElementById("health"),
  mana: document.getElementById("mana"),
  stamina: document.getElementById("stamina"),
  spirit: document.getElementById("spirit"),
  concentration: document.getElementById("concentration")
}

const dirElms = {
  n: document.getElementById("north"),
  ne: document.getElementById("northeast"),
  e: document.getElementById("east"),
  se: document.getElementById("southeast"),
  s: document.getElementById("south"),
  sw: document.getElementById("southwest"),
  w: document.getElementById("west"),
  nw: document.getElementById("northwest"),
  up: document.getElementById("up"),
  down: document.getElementById("down"),
  out: document.getElementById("out")
};

const roomElms = {
  name: document.getElementById("room-name"),
  description: document.getElementById("room-description"),
  items: document.getElementById("room-items"),
  mobs: document.getElementById("room-mobs"),
  players: document.getElementById("room-players"),
  exits: document.getElementById("room-exits")
};

// const btnElms = {
//   playBtn: document.getElementById("play-btn"),
//   exitBtn: document.getElementById("exit-btn"),
//   toggleDevtoolsBtn: document.getElementById("toggle-devtools-btn"),
//   reloadBtn: document.getElementById("reload-btn")
// }

const goNouns = {
  // default to go action on click, alternate is get for now
  "arch": true,
  "archway": true,
  "bank": true,
  "bridge": true,
  "door": true,
  "embankment": true,
  "footpath": true,
  "gap": true,
  "gate": true,
  "path": true,
  "pond": true,
  "shop": true,
  "trail": true
}

// Event Listeners:
document.addEventListener("keydown", navigateByKeypad, true);
commandInput.addEventListener("keydown", interceptInputSpecialKeys);
compassContainer.addEventListener("click", navigateByCompass);
ipcRenderer.on('gametext', processMsgFromServer);

// btnElms.playBtn.addEventListener("click", playBtnFn);
// btnElms.exitBtn.addEventListener("click", () => console.log('exitBtn'));
// btnElms.toggleDevtoolsBtn.addEventListener("click", () => console.log("devBtn"));
// btnElms.reloadBtn.addEventListener("click", () => console.log('reload'));

// function playBtnFn() {
//   passCmdToServer("#connect");
//   commandInput.focus();
// }

function enterCommand() {
  const text = commandInput.value;
  if (!text.length) return;
  commandInput.select();
  passCmdToServer(text);
}

function passCmdToServer(str) {
  addCmdToHistory(str);
  if (str.startsWith("#clear")) return clearGameText();
  ipcRenderer.send('asynchronous-message', str);
  appendGameText("> " + str + "\n");
}

function appendGameText(text) {
  let cleanedText = replaceXMLwithHTML(text);
  cleanedText = hideXML(cleanedText);
  if (!cleanedText) return;
  console.log('CLEANED TEXT:', cleanedText);
  cleanedText = cleanedText.replace(/[\r\n]+/g, "<br>")
  const newParagraph = document.createElement("p");
  newParagraph.innerHTML = cleanedText;
  // todo: start removing when too many children
  gameText.appendChild(newParagraph);
  gameText.scrollTop = gameText.scrollHeight
}

function addCmdToHistory(cmd) {
  if (cmd.length < minLengthCmdToSave) return;
  if (cmd === cmdHistory[cmdIndex - 1]) return;
  cmdHistory[cmdIndex] = cmd;
  cmdLookupIndex = cmdIndex;
  cmdIndex++;
  if (Object.keys(cmdHistory).length > maxCmdHistory)
    delete cmdHistory[cmdIndex - maxCmdHistory - 1];
}

function interceptInputSpecialKeys(e) {
  if (e.key === "Enter") return enterCommand();
  if (e.key === "ArrowUp") return retrievePreviousCommand();
  if (e.key === "ArrowDown") return retrieveNextCommand();
}

function retrievePreviousCommand() {
  cmdLookupIndex--;
  if (cmdHistory[cmdLookupIndex]) {
    const prevCommand = cmdHistory[cmdLookupIndex];
    commandInput.value = prevCommand;
  }
  else cmdLookupIndex++;
}

function retrieveNextCommand() {
  cmdLookupIndex++;
  if (cmdHistory[cmdLookupIndex]) {
    const nextCommand = cmdHistory[cmdLookupIndex];
    commandInput.value = nextCommand;
  }
  else cmdLookupIndex--;
}

function navigateByCompass(e) {
  const direction = e.srcElement.id
  passCmdToServer(direction);
}

function navigateByKeypad(e) {
  if ((e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 110) {
    e.preventDefault();
    e.stopPropagation();
  }
  // todo: prevent typing this in commandInput bar
  switch (e.keyCode) {
    case 104:
      passCmdToServer("north");
      break;
    case 105:
      passCmdToServer("northeast");
      break;
    case 102:
      passCmdToServer("east");
      break;
    case 99:
      passCmdToServer("southeast");
      break;
    case 98:
      passCmdToServer("south");
      break;
    case 97:
      passCmdToServer("southwest");
      break;
    case 100:
      passCmdToServer("west");
      break;
    case 103:
      passCmdToServer("northwest");
      break;
    case 101:
      passCmdToServer("out");
      break;
    case 110:
      passCmdToServer("up");
      break;
    case 96:
      passCmdToServer("down");
      break;
    default:
      return;
  }
}

function clearGameText() {
  gameText.innerHTML = "";
}

function processMsgFromServer(event, msg) {
  const { type, detail, globals } = msg;
  if (type === "gametext") {
    console.log(detail);
    return appendGameText(detail);
  }
  console.log("non-text event fired. type:", type, "detail:", detail);
  if (type === "roundTime") return updateRoundTime(globals.roundTime)
  if (type === "room") return updateRoom(globals.room);
  if (type === "room objects") return updateRoomObjects(globals.room);
  if (type === "room players") return updateRoomPlayers(globals.room);
  if (type === "hand") {
    return detail === "right"
      ? updateHand("right", globals.rightHand)
      : updateHand("left", globals.leftHand);
  }
  if (type === "globals") return console.log("GLOBALS:\n", globals);
  if (type === "bodyPosition") return updateBodyPosition(globals.bodyPosition);
  if (type === "vitals") return updateVitals(detail, globals.vitals[detail]);
  if (type === "preparedSpell") return updatePreparedSpell(globals.preparedSpell);
  if (type === "activeSpells") return updateActiveSpells(globals.activeSpells);
  if (type === "wornInventory") return updateWornInventory(globals.wornInventory);
  if (type === "experience") return updateExperience(globals.exp);
  if (type === "stow") return updateStowItems(globals.stow)
  console.log('Unknown event fired:', type);
}

function replaceXMLwithHTML(str) {
  // also, multi-line replacements
  // login wall-of-text:
  str = str.replace(/<mode id="GAME"\/>.*<\/settings>/g, "");
  // The above is sending 5-6 times, how to prevent? longer pause on connect?
  // now the subs
  str = str.replace(/<output class="mono"\/>/, '<p class="monospace">'); // beginning of monospace, cool
  str = str.replace(/<output class=""\/>/, "</p>"); // end of monospace
  // str = str.replace(/<pushBold\/>/g, '<span class="bold">');
  // str = str.replace(/<popBold\/>/g, "</span>");
  str = str.replace(/<pushBold\/>/g, '<strong>');
  str = str.replace(/<popBold\/>/g, "</strong>");
  return str;
}

function hideXML(str) {
  // todo: move this to xml.js and only send visible text to game window
  const spellsMatch = str.match(/^([\s\S\r\n]*)<pushStream id="percWindow"\/>[\w\(\)\d\r\n ]+<popStream\/>([\s\S\r\n]*)$/);
  if (spellsMatch) str = spellsMatch[1] + spellsMatch[2];
  const invMatch = str.match(/<pushStream id='inv'\/>[\s\S\r\n.]+<popStream\/>([\s\S\r\n]*)$/);
  if (invMatch) str = invMatch[1]; // is the prefix here ever relevant?

  // str = str.replace(/<clearStream id=.\S+.[^>]*\/>/g, "");
  str = str.replace(/<clearContainer id=.\S+.\/>/, "");
  str = str.replace(/<prompt.*<\/prompt>/, "");
  str = str.replace(/<spell.*<\/spell>/, "");
  str = str.replace(/<prompt time=.\d+.>.*<\/prompt>/, ""); // why is this necessary?
  str = str.replace(/<component.*\/component>/g, "");
  str = str.replace(/<resource picture="\d+"\/>/, "");
  str = str.replace(/<style id="roomName" \/>/, "");
  str = str.replace(/<style id=""\/>/, "");
  str = str.replace(/<preset id='roomDesc'>/, "");
  str = str.replace(/<\/preset>/, "");
  str = str.replace(/<\/?d>/g, "");
  str = str.replace(/<compass>.*<\/compass>/, "");
  str = str.replace(/<nav\/>/, "");
  str = str.replace(/<streamWindow .+\/>/g, "");
  str = str.replace(/<right.*<\/right>/, "");
  str = str.replace(/<left.*<\/left>/, "");
  str = str.replace(/<inv id=.\S+.>[^<]*<\/inv>/g, "");
  str = str.replace(/<d cmd="\S*">/g, ""); // useful for later, this is a command link
  str = str.replace(/<roundTime value='\d+'\/>/, "");
  str = str.replace(/<dialogData id='minivitals'>[\s\S]+<\/dialogData>/, "");

  // str = str.replace(/<compDef .+<\/compDef>/, ""); // login, sends exp skills
  // str = str.replace(/<mode id="GAME"\/>/, ""); // login, useless...
  // str = str.replace(/<app char="Kruarnode" game="DR" title="[DR: Kruarnode] StormFront"\/>/); // login, could get char name and instance from here
  // str = str.replace(/<exposeContainer id='stow'\/>/); //login...
  // str = str.replace(/<container id='.+' title=".+" target='.+' location='.+' save='.+' resident='.+'\/>/); // login - note this sends ID of stow container? maybe?
  str = str.replace(/^\s*\n/mg, ""); // empty lines
  str = str.replace(/^\s*&lt;/, "<"); // beginning of attack
  return str;
}

function updateRoom(room) {
  const { name, description, exits } = room;
  updateCompass(exits);
  roomElms.name.textContent = `[${name}]`;
  roomElms.description.textContent = description;
  roomElms.exits.innerHTML = generateClickableRoomExits(exits.array);
}

function updateRoomObjects(room) {
  const { items, mobs } = room;
  roomElms.items.innerHTML = generateClickableRoomItems(items);
  roomElms.mobs.innerHTML = generateClickableRoomMobs(mobs);
  console.log('mobs:', mobs);
}

function updateRoomPlayers(room) {
  const { playersArray } = room;
  roomElms.players.innerHTML = generateClickableRoomplayers(playersArray);
}

function generateClickableRoomplayers(playersArray) {
  if (!playersArray.length) return "Also here: no one.";
  return "Also here: " + playersArray.map(playerFullName => {
    const playerName = getPlayerName(playerFullName);
    return `<span class="room-player" onclick="passCmdToServer('look at ${playerName}')">${playerFullName}</span>`
  }).join(" | ");
}

function generateClickableRoomExits(exitsArray) {
  if (!exitsArray.length) return "Obvious exits: none";
  return "Obvious exits: " + exitsArray.map(exit => (
    `<span class="room-exit" onclick="passCmdToServer('${exit}')">${exit}</span>`
  )).join(" | ");
}

function generateClickableRoomItems(itemArray) {
  const items = itemArray.length;
  if (!items) return "0 Items";
  const prefix = items > 1 ? `${items} Items: ` : "1 Item: ";
  return prefix + itemArray.map(roomObj => {
    const noun = getObjNoun(roomObj).toLowerCase();
    const clickCommand = generateClickCommand(noun);
    return `<span class="room-item" onclick="passCmdToServer('${clickCommand}')">${roomObj}</span>`;
  }).join(" | ");
}

function generateClickableRoomMobs(mobArray) {
  const mobs = mobArray.length;
  if (!mobs) return "0 Mobs";
  const prefix = mobs > 1 ? `${mobs} Mobs: ` : "1 Mob: ";
  return prefix + mobArray.map(mobName => {
    const noun = getObjNoun(mobName).toLowerCase();
    return `<span class="room-mob" onclick="passCmdToServer('advance ${noun}')">${mobName}</span>`;
  }).join(" | ");
}

function updateHand(hand, { id, noun, item }) {
  const handDisplayElm = hand === "right" ? rightHandDisplay : leftHandDisplay;
  if (!item) return handDisplayElm.textContent = "";
  const handHTML = `<span class="held-item" onclick="passCmdToServer('stow ${id}')">${item}</span>`;
  handDisplayElm.innerHTML = handHTML;
}

function updateRoundTime(roundTime) {
  roundtimeDisplay.textContent = roundTime > 0 ? roundTime : "";
}

function updateBodyPosition(bodyPosition) {
  bodyPositionDisplay.textContent = bodyPosition;
}

function updateCompass(exits) {
  dirElms.n.setAttribute("data-direction-exists", exits.north);
  dirElms.ne.setAttribute("data-direction-exists", exits.northeast);
  dirElms.e.setAttribute("data-direction-exists", exits.east);
  dirElms.se.setAttribute("data-direction-exists", exits.southeast);
  dirElms.s.setAttribute("data-direction-exists", exits.south);
  dirElms.sw.setAttribute("data-direction-exists", exits.southwest);
  dirElms.w.setAttribute("data-direction-exists", exits.west);
  dirElms.nw.setAttribute("data-direction-exists", exits.northwest);
  dirElms.up.setAttribute("data-direction-exists", exits.up);
  dirElms.down.setAttribute("data-direction-exists", exits.down);
  dirElms.out.setAttribute("data-direction-exists", exits.out);
}

function updateVitals(vital, value) {
  vitalElms[vital].textContent = value;
}

function updateActiveSpells(activeSpellsArr) {
  const activeSpellsHTML = activeSpellsArr.map(spellText => (
    `<div>${spellText}</div>`
  )).join("");
  spellsDisplay.innerHTML = activeSpellsHTML;
}

function updateWornInventory(wornItemArr) {
  const wornItemsHTML = wornItemArr.map(itemText => (
    `<div class="worn-item" onclick="passCmdToServer('remove my ${getObjNoun(itemText)}')">${itemText}</div>`
  )).join("");
  wornItemsDisplay.innerHTML = wornItemsHTML;
}

function updateExperience(allExp) {
  // it would be cool to pop up a tooltip on hover showing full exp
  // and also mute the scroll from the main window if hovering
  const expHTML = Object.values(allExp)
    .filter(e => (e.rate > 0))
    .map(e => (`<div class="skill-display" onclick="passCmdToServer('exp ${e.displayName}')">${e.displayStr}</div>`))
    .join("");
  experienceDisplay.innerHTML = expHTML;
}

function updateStowItems(stow) {
  const { uniqueItems, container } = stow;
  // console.log('Update stow items:', uniqueItems);
  const stowHTML = Object.keys(uniqueItems).map(item => {
    const count = uniqueItems[item];
    return count === 1
      ? `<div class="stow-item" onclick="passCmdToServer('get ${item} from my ${container}')">${item}</div>`
      : `<div class="stow-item" onclick="passCmdToServer('get ${item} from my ${container}')">${item} (${count})</div>`;
  }).join("");
  stowItemsDisplay.innerHTML = stowHTML;
  stowItemContainerDisplay.textContent = `In the ${container}:`;
}

function updatePreparedSpell(spell) {
  preparedSpellDisplay.textContent = spell;
}

function getObjNoun(str) {
  const nounMatch = str.match(/.+ (\S+)$/);
  if (nounMatch && nounMatch[1]) return nounMatch[1];
  return str;
}

function getPlayerName(str) {
  str = str.replace(/ who is .+/, "");
  const nameMatch = str.match(/.+ (\S+)/);
  if (nameMatch && nameMatch[1]) return nameMatch[1];
  return str;
}

function generateClickCommand(noun) {
  // if monsterbold, launch attack on click?
  if (goNouns[noun]) return "go " + noun;
  return "get " + noun;
}