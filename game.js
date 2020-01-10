// connects to DR
"use strict";
require("dotenv").config();
const net = require("net");
const { parentPort: pp } = require("worker_threads");
const client = new net.Socket();
const getConnectKey = require("./sge");

// no need for export, this will be executed via worker thread

pp.on("message", message => {
  console.log("gamejs Received message:", message);
  sendCommandToGame(message);
  // pp.postMessage({ pong: message });
  // todo: test throwing an error here

  // pp.postError("test");
  // console.log("inside script, message is:", message);
  // if (message === "You fall over.")
  //   pp.postMessage({ command: "stand" });
  // else pp.postMessage({ resonpse: "ignore" });
});
let buffer = "";

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

client.on("data", data => {
  // detects incomplete data fragments - if line does not end with \r\n, the data is split and we need to await the next packet before displaying/parsing all the data
  let gameStr = buffer + data.toString(); // todo: use actual buffer here?
  if (!gameStr.match(/\r\n$/)) {
    buffer += gameStr;
    return;
  }
  buffer = "";

  // console.log(gameStr);
  pp.postMessage(gameStr); // send game data back to Main.js
});

client.on("close", function () {
  console.log("Connection closed");
  process.exit(0); // todo: test this
});

function sendCommandToGame(commands) {
  commands.split(";").forEach(command => {
    client.write(command + "\n");
    console.log("COMMAND: " + command);
  });
}