// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require('electron')

let cmdHistory = {
  0: ""
};
let cmdIndex = 1;
let cmdLookupIndex = 1;
const maxCmdHistory = 50;
const minLengthCmdToSave = 2;

ipcRenderer.on('gametext', (event, message) => {
  console.info(message);
  appendGameText(message);
})

const submitBtn = document.querySelector("button#submit-command");
const clearTextBtn = document.querySelector("button#clear-text");
const input = document.querySelector("input#commands");
const gameText = document.querySelector("div#game");
// const textArea = document.querySelector("textarea");

submitBtn.addEventListener("click", sendCommandText);
clearTextBtn.addEventListener("click", () => {
  gameText.innerHTML = "";
})
input.addEventListener("keydown", e => {
  if (e.key === "Enter") return sendCommandText();
  if (e.key === "ArrowUp") return retrievePreviousCommand();
  if (e.key === "ArrowDown") return retrieveNextCommand();
  // console.log(e.key)

});

function sendCommandText() {
  const text = input.value;
  if (!text.length) return;
  input.select(); // select the text
  sendText(text);
}

function sendText(str) {
  addCmdToHistory(str);
  ipcRenderer.send('asynchronous-message', str);
  appendGameText("> " + str + "\n");
}

function appendGameText(text) {
  let cleanedText = replaceXMLwithHTML(text);
  cleanedText = hideXML(text);
  if (!cleanedText) return;
  // const newDiv = document.createElement("div");
  // newDiv.textContent = text;
  // gameText.appendChild(newDiv);
  // window.scrollTo(0, gameText.scrollHeight);

  // textArea.value += cleanedText;
  // setTimeout(() => {
  //   textArea.scrollTop = textArea.scrollHeight
  // }, 0);
  cleanedText = cleanedText.replace(/[\r\n]+/g, "<br>")
  gameText.innerHTML += cleanedText + "<br>";
  setTimeout(() => {
    gameText.scrollTop = gameText.scrollHeight
  }, 0);
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

document.addEventListener("keydown", e => {
  if (e.keyCode >= 96 && e.keyCode <= 105) {
    e.preventDefault();
    e.stopPropagation();
  }
  // todo: prevent typing this in input bar
  switch (e.keyCode) {
    case 104:
      sendText("north");
      break;
    case 105:
      sendText("northeast");
      break;
    case 102:
      sendText("east");
      break;
    case 99:
      sendText("southeast");
      break;
    case 98:
      sendText("south");
      break;
    case 97:
      sendText("southwest");
      break;
    case 100:
      sendText("west");
      break;
    case 103:
      sendText("northwest");
      break;
    case 101:
      sendText("out");
      break;
    case 110:
      sendText("up");
      break;
    case 96:
      sendText("down");
      break;
    default:
      return;
  }
}, true);

function replaceXMLwithHTML(str) {
  str = str.replace(/<output class="mono"\/>/, '<p class="monospace">'); // beginning of monospace, cool
  str = str.replace(/<output class=""\/>/, "</p>"); // end of monospace
  console.log('replaced...')
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
  str = str.replace(/<pushBold\/>/g, "");
  str = str.replace(/<popBold\/>/g, "");
  str = str.replace(/<streamWindow .+\/>/g, "");
  str = str.replace(/<right.*<\/right>/, "");
  str = str.replace(/<left.*<\/left>/, "");
  str = str.replace(/<inv id=.\S+.>[^<]*<\/inv>/g, "");
  str = str.replace(/<d cmd="\S*">/g, ""); // useful for later, this is a command link
  str = str.replace(/<roundTime value='\d+'\/>/, "");
  str = str.replace(/<dialogData id='minivitals'>[\s\S]+<\/dialogData>/, "");
  str = str.replace(/^\s*&lt;/, "<"); // beginning of attack
  str = str.replace(/^\s*\n/mg, ""); // empty lines
  return str;
}

//  still not working: <prompt time="1578644812">&gt;</prompt>