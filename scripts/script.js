// for inspiration, when I have time: https://github.com/WarlockFE/warlock2/wiki/Javascript-Scripting

const { parentPort: pp } = require("worker_threads");

const forever = () => new Promise(r => setInterval(() => { }, 1000));

async function script() {
  pp.on("message", message => {
    console.log("Received message:", message);
    pp.postMessage({ pong: message });
    // todo: test throwing an error here

    // pp.postError("test");
    // console.log("inside script, message is:", message);
    // if (message === "You fall over.")
    //   pp.postMessage({ command: "stand" });
    // else pp.postMessage({ resonpse: "ignore" });
  });

  console.log("await loaded");
  await forever(); // ok cool, script returns even while this awaits
}
script();

module.exports = script;
