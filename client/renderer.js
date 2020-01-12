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

const input = document.querySelector("input#commands");
const gameText = document.querySelector("div#game");
const compassContainer = document.querySelector("#compass-container");
const rightHand = document.querySelector("div#right-hand");
const leftHand = document.querySelector("div#left-hand");

const dirElms = {
  n: document.querySelector("#north"),
  ne: document.querySelector("#northeast"),
  e: document.querySelector("#east"),
  se: document.querySelector("#southeast"),
  s: document.querySelector("#south"),
  sw: document.querySelector("#southwest"),
  w: document.querySelector("#west"),
  nw: document.querySelector("#northwest"),
  up: document.querySelector("#up"),
  down: document.querySelector("#down"),
  out: document.querySelector("#out")
};

const roomElms = {
  name: document.querySelector("#room-name"),
  description: document.querySelector("#room-description"),
  objects: document.querySelector("#room-objects"),
  players: document.querySelector("#room-players"),
  exits: document.querySelector("#room-exits")
};

const goNouns = {
  // default to go action on click, alternate is get for now
  "bank": true,
  "door": true,
  "footpath": true,
  "gap": true,
  "gate": true,
  "path": true,
  "shop": true,
  "trail": true
}

// Event Listeners:
document.addEventListener("keydown", navigateByKeypad, true);
input.addEventListener("keydown", interceptInputSpecialKeys);
compassContainer.addEventListener("click", navigateByCompass);
ipcRenderer.on('gametext', processMsgFromServer);

function enterCommand() {
  const text = input.value;
  if (!text.length) return;
  input.select();
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
    input.value = prevCommand;
  }
  else cmdLookupIndex++;
}

function retrieveNextCommand() {
  cmdLookupIndex++;
  if (cmdHistory[cmdLookupIndex]) {
    const nextCommand = cmdHistory[cmdLookupIndex];
    input.value = nextCommand;
  }
  else cmdLookupIndex--;
}

function navigateByCompass(e) {
  const direction = e.srcElement.id
  passCmdToServer(direction);
}

function navigateByKeypad(e) {
  if (e.keyCode >= 96 && e.keyCode <= 105) {
    e.preventDefault();
    e.stopPropagation();
  }
  // todo: prevent typing this in input bar
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
  if (type === "globals") return console.log("GLOBALS:\n", globals);
  if (type === "room") return updateRoom(globals.room);
  if (type === "room objects") return updateRoomObjects(globals.room);
  if (type === "room players") return updateRoomPlayers(globals.room);
  // if (type === "rightHand") return updateRightHand(globals.rightHand);
  // if (type === "leftHand") return updateLeftHand(globals.leftHand);
}

function replaceXMLwithHTML(str) {
  // also, multi-line replacements
  // login wall-of-text:
  str = str.replace(/<mode id="GAME"\/>.*<\/settings>/g, "");
  // The above is sending 5-6 times, how to prevent? longer pause on connect?
  // now the subs
  str = str.replace(/<output class="mono"\/>/, '<p class="monospace">'); // beginning of monospace, cool
  str = str.replace(/<output class=""\/>/, "</p>"); // end of monospace
  str = str.replace(/<pushBold\/>/g, '<span class="bold">');
  str = str.replace(/<popBold\/>/g, "</span>");
  return str;
}

function hideXML(str) {
  str = str.replace(/<clearStream id=.\S+.[^>]*\/>/g, "");
  str = str.replace(/<clearContainer id=.\S+.\/>/, "");
  str = str.replace(/<pushStream[^>]+\/>[^<]+<popStream\/>/g, "");
  str = str.replace(/<popStream\/>/, ""); // I have no idea why this is necessary.
  str = str.replace(/<prompt.*<\/prompt>/, "");
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
  const { objectsArray } = room;
  roomElms.objects.innerHTML = generateClickableRoomObjects(objectsArray);
}

function updateRoomPlayers(room) {
  const { playersArray } = room;
  roomElms.players.innerHTML = generateClickableRoomplayers(playersArray);
}

function updateRightHand(rightHand) {
  // rightHand

}

function updateLeftHand(leftHand) {
  // leftHand
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
    `<span class="room-exit-item" onclick="passCmdToServer('${exit}')">${exit}</span>`
  )).join(" | ");
}

function generateClickableRoomObjects(objArr) {
  if (!objArr.length) return "You also see: nothing.";
  else return "You also see: " + objArr.map(roomObj => {
    const noun = getObjNoun(roomObj).toLowerCase();
    const clickCommand = generateClickCommand(noun);
    return `<span class="room-object-item" onclick="passCmdToServer('${clickCommand}')">${roomObj}</span>`;
  }).join(" | ");
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
  if (goNouns[noun]) return "go " + noun;
  return "get " + noun;
}