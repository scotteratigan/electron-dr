// https://nodejs.org/api/worker_threads.html
const { Worker } = require("worker_threads");
const path = require("path");
const fs = require("fs");

const sleep = ms => new Promise(r => setTimeout($ => r(), ms));
// const forever = () => new Promise(r => setInterval(() => { }, 1000));
const SCRIPT_FOLDER = "scripts";

async function runScript(scriptName) {
  const scriptPath = getScriptPath(scriptName);
  console.log("script path:", scriptPath);
  const scriptFound = await scriptExists(scriptPath);
  if (!scriptFound) return console.error("No script by that name found!");
  const script = new Worker("./" + scriptPath, {}); //eval: true?
  script.on("message", message => console.log(message));
  script.on("error", message => console.error("Error:", message));
  script.on("online", () => console.log("script started:", scriptName));
  await sleep(500);
  script.postMessage({ test: "message" });
  await sleep(500);
  script.postMessage("You fall over.");
  await sleep(500);
  console.log("terminating");
  await script.terminate();
  console.log("terminated.");
}

function getScriptPath(str) {
  const match = str.match(/\.js$/i);
  if (match) return path.join(SCRIPT_FOLDER, str);
  return path.join(SCRIPT_FOLDER, str + ".js");
}

async function scriptExists(scriptPath) {
  return new Promise((res, rej) => {
    console.log("SCRIPT PATH IS:", scriptPath);
    fs.access(scriptPath, err => (err ? res(false) : res(true)));
    // fs.exists(scriptPath, exists => (exists ? res(true) : res(false)));
  });
}

module.exports = runScript;
