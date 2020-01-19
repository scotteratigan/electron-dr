const path = require('path')
const fs = require('fs')
const { Worker } = require('worker_threads') // to run game server

// Needs to be launched as a worker thread so that it can be terminated

// Functionality:

// Control Commands
// Pause, Resume, Toggle, Abort


// function loadScript(scriptFileName, sendCommandToGame, globals) {
//   return new Promise((resolve, reject) => {
//     if (!scriptFileName) return console.error('Must specify a file name!')
//     const directoryPath = path.join(__dirname, 'scripts')
//     fs.readdir(directoryPath, async (err, fileNameList) => {
//       if (err)
//         return console.log(
//           'Unable to open list of script files in /script directory:',
//           err
//         )
//       // for now, no fancy checking:
//       if (!fileNameList.includes(scriptFileName + '.js')) {
//         console.error('Could not find script named', scriptFileName)
//       }
//       const scriptFullPath = path.join(directoryPath, scriptFileName + '.js')
//       try {
//         removeScriptFromCache(scriptFullPath)
//         let load = require(scriptFullPath)
//         let { run, parseText } = await load(sendCommandToGame, globals)
//         resolve(parseText)
//         await run()
//         parseText = () => { }
//         console.log('Script ended:', scriptFileName)
//       } catch (err) {
//         console.error('Error running script', scriptFileName, ':', err)
//         return reject(() => { })
//       }
//     })
//   })
// }

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



  return { sendTextToScript, sendXMLeventToScript }
}

module.exports = loadScript;

// function removeScriptFromCache(path) {
//   console.log('clearing script cache:', path)
//   delete require.cache[path]
// }
