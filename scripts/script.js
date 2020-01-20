// for inspiration, when I have time: https://github.com/WarlockFE/warlock2/wiki/Javascript-Scripting

const { parentPort: connection } = require('worker_threads')
let globals;
const send = command => connection.postMessage(command)
const echo = text => send("#echo " + text);
// const forever = () => new Promise(r => setInterval(() => { }, 1000));
const sleep = seconds => new Promise(r => setTimeout(() => r(), seconds * 1000))
const globalHasVal = (xmlVar, value) => new Promise((res, rej) => {
  let interval = setInterval(() => {
    if (globals[xmlVar] === value) {
      clearInterval(interval);
      return res()
    }
    console.log(globals.roundTime)
  }, 1000)
})
const rt = () => new Promise(async (res, rej) => {
  await sleep(.5)
  let interval = setInterval(() => {
    if (globals["roundTime"] <= 0) {
      clearInterval(interval)
      return res()
    }
    console.log('rt:', globals["roundTime"])
  }, 25)
})
// const move = moveCommand => new Promise(async res => {
//   console.log('globals:', globals) // globals is undefined here for some reason
//   return res();
//   const startRoomDesc = globals["room"]["description"]
//   send(moveCommand)
//   let interval = setInterval(() => {
//     const newRoomDesc = globals["room"]["description"]
//     if (startRoomDesc !== newRoomDesc) {
//       clearInterval(interval)
//       return res()
//     }
//   }, 25)
// })

connection.on('message', message => {
  const { event } = message
  if (event === "text") {
    const { text } = message
    return parseText(text)
  }
  // { event: "xml", xmlVar, detail, globals }
  if (event === "xml") {
    const { xmlVar, detail = "", globals } = message
    return parseXML(xmlVar, detail, globals)
  }
  if (event === "control") {
    const { command } = message;
    if (command === "#abort") return process.exit(0); // this doesn't really unload it?
    else console.error("Unknown script command received:", command);
  }
  console.log('unhandled event to script:', event)
})

let moved = false;

function parseText(text) {
  console.log('parsing text:', text.substring(0, 15) + "...")
  // if (!text) return;
  if (text.includes("Obvious paths:")) {
    moved = true; // todo: do this in xml
  }
}

function parseXML(xmlVar, detail, gameGlobals) {
  console.log('xmlVar:', xmlVar);
  globals = gameGlobals; // assign local obj here to values from game
  // console.log('globals:', globals);
}


async function script() {
  await move("n")
  // await move("n")
  // await move("ne")
  // await move("nw")
  send("forage")
  await sleep(1)
  // await globalHasVal("roundTime", 0)
  await rt()
  send("forage")
  await rt()
  echo("*** SCRIPT EXITING ***")
  // await sleep(5);
  process.exit(0)
}
script();

// script received message: {
//   event: 'text',
//   value: '<output class="mono"/>\r\n' +
//     '\r\n' +

// script received message: {
//   event: 'xml',
//   variable: 'gameTime',
//   detail: '',
//   globals: {
//     connected: false,
//     bodyPosition: '',
//     exp: {},
//     room: {
//       name: '',
//       description: '',
//       items: [],

