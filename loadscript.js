const path = require('path')
const fs = require('fs')
const { Worker } = require('worker_threads') // to run game server

// Needs to be launched as a worker thread so that it can be terminated

// Functionality:

// Control Commands
// Pause, Resume, Toggle, Abort



// todo: add function to parse raw xml in script as well

function loadScript(name, sendCommand) {
  let script;
  // todo: how to tie in globals in more performant way? I know there's some array method or something unique to workers
  try {
    script = new Worker(`./scripts/${name}.js`, {});
  } catch (err) {
    console.error("Error launching script worker:", err);
  }

  script.on("message", command => {
    // when script sends command, pass to main
    try {
      sendCommand(command);
    } catch (err) {
      console.error("Error sending command from script to game:", err);
    }
  })

  function sendTextToScript(text) {
    console.log("Forwarding message to script:", text.substring(0, 15) + "...");
    script.postMessage({ event: "text", text });
  }

  function sendXMLeventToScript(xmlVar, detail, globals) {
    // console.log("Forwarding xml event to script:", xmlVar, detail);
    script.postMessage({ event: "xml", xmlVar, detail, globals }); // this should work for now
  }

  function sendControlCommandToScript(command) {
    if (command === "#abort") {
      console.log('ATTEMPTING TO TERMINATE SCRIPT')
      script.terminate();
    }
    else script.postMessage({ event: "control", command })
  }

  return { sendTextToScript, sendXMLeventToScript, sendControlCommandToScript }
}

module.exports = loadScript;

// function removeScriptFromCache(path) {
//   console.log('clearing script cache:', path)
//   delete require.cache[path]
// }
