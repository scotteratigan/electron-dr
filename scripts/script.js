// for inspiration, when I have time: https://github.com/WarlockFE/warlock2/wiki/Javascript-Scripting

const { parentPort: connection } = require('worker_threads')
const send = command => connection.postMessage(command);
const echo = text => send("#echo " + text); // note: this echo goes to game console, not visible to client
// const forever = () => new Promise(r => setInterval(() => { }, 1000));
const sleep = seconds => new Promise(r => setTimeout(() => r(), seconds * 1000))


connection.on('message', message => {
  const { event } = message;
  if (event === "text") {
    const { text } = message;
    return parseText(text);
  }
  console.log('event:', event);
})

let moved = false;

function parseText(text) {
  console.log('parsing text:', text.substring(0, 15) + "...")
  // if (!text) return;
  if (text.includes("Obvious paths:")) {
    moved = true; // todo: do this in xml
  }
}

// function parseXML(xmlVar, detail, globals) {
// }


async function script() {
  send("exp")
  await sleep(15)
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

