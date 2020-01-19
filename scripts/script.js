// for inspiration, when I have time: https://github.com/WarlockFE/warlock2/wiki/Javascript-Scripting

const { parentPort: pp } = require('worker_threads')

// const forever = () => new Promise(r => setInterval(() => { }, 1000));
const sleep = seconds => new Promise(r => setTimeout(() => r(), seconds * 1000))

pp.on('message', message => {
  console.log('script received message:', message);
})

async function script() {
  await sleep(5);
  pp.postMessage("exp")
  await sleep(5);
  pp.postMessage("exp")
  await sleep(5);
  pp.postMessage("exp")
}
script();

// async function script(sendCommandToGame, globals) {
//   pp.on('message', message => {
//     console.log('Received message:', message)
//     pp.postMessage({ pong: message })
//     // todo: test throwing an error here

//     // pp.postError("test");
//     // console.log("inside script, message is:", message);
//     // if (message === "You fall over.")
//     //   pp.postMessage({ command: "stand" });
//     // else pp.postMessage({ resonpse: "ignore" });
//   })

//   console.log('await loaded')
//   // await forever(); // ok cool, script returns even while this awaits

//   await sleep(1)
//   sendCommandToGame('west')
//   console.log('trying to send west')
//   await sleep(5)
//   sendCommandToGame('east')
//   console.log('trying to send east')
// }
// script()

// module.exports = script
