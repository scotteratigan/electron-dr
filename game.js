"use strict";
require("dotenv").config();
const net = require("net");
const { parentPort: frontEnd } = require("worker_threads");
const client = new net.Socket();
const getConnectKey = require("./sge");

// no need for export, this will be executed via worker thread

// Initialization Stuff:
const globals = {};
let parseXML = () => { };
loadXMLparser(); // loads or re-loads the parseXML function

// Actions / Runtime:

// Message from client:
frontEnd.on("message", command => {
  if (command.startsWith(".")) {
    console.log('prepare to launch script!');
    return;
  }
  if (command.startsWith("#xml")) {
    frontEnd.postMessage({ type: "gametext", value: "*** Reloading XML Parser. ***" });
    return loadXMLparser();
  }
  if (command.startsWith("#var")) {
    return frontEnd.postMessage({ type: "globals", value: globals });
  }

  sendCommandToGame(command);
});
let buffer = "";

// Game sends data:
client.on("data", data => {
  // detects incomplete data fragments - if line does not end with \r\n,
  // the data is split and we need to wait for the next packet before displaying/parsing all the data
  // This happens most frequently with logon text which is sent in huge chunks
  let gameStr = buffer + data.toString(); // todo: use actual buffer here?
  if (!gameStr.match(/\r\n$/)) {
    buffer += gameStr;
    return;
  }
  buffer = "";
  // Parse XML for updates:
  try {
    parseXML(gameStr);
  } catch (err) {
    console.error('Uncaught error parsing xml:', err);
  }

  // Send game data back to Main.js to pass on to client:
  frontEnd.postMessage({ type: "gametext", value: gameStr });
});

client.on("close", function () {
  console.log("Connection closed.");
  frontEnd.postMessage({ type: "gametext", value: "Connection closed." });
  process.exit(0);
});

// Actual Connect process:

getConnectKey((connectKey, ip, port) => {
  console.log("Received connect key:", connectKey);
  client.connect(port, ip, function () {
    console.log("Connected, sending key.".green);
    setTimeout(() => {
      client.write(connectKey + "\n");
    }, 100);
    setTimeout(() => {
      client.write("/FE:STORMFRONT /VERSION:1.0.1.22 /XML\n");
    }, 200);
    setTimeout(() => {
      client.write("l\n");
    }, 500); // testing shorter timeout here
  });
});

// Helper Functions:

function sendCommandToGame(commands) {
  commands.split(";").forEach(command => {
    client.write(command + "\n");
    console.log("COMMAND: " + command);
  });
}

function globalUpdated(global, detail) {
  // todo: make global object fully available on each update?
  // console.log("Global trigger on XML:", global, "with detail", detail);
  if (global === "room") frontEnd.postMessage({ type: "room update", value: globals.room });
  if (global === "room objects") frontEnd.postMessage({ type: "room objects", value: globals.room });
  if (global === "room players") frontEnd.postMessage({ type: "room players", value: globals.room });
}

function loadXMLparser() {
  parseXML = () => { };
  // Todo: replace with non-iterative solution. Need to find how to get root directory.
  for (const fullPath in require.cache) {
    if (fullPath.endsWith("xml.js"))
      delete require.cache[fullPath];
  }
  const setupXMLparser = require("./xml.js");
  parseXML = setupXMLparser(globals, globalUpdated);
}