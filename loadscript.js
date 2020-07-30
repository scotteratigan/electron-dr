const path = require('path')
const { Worker } = require('worker_threads')
let script;
// todo: allow array of script workers

function scriptRunner(sendCommand) {
  return function processScriptEvent(event, detail, globals = {}) {
    //event can be 'command' or 'text' or 'xml'
    if (event === 'command') {
      if (detail.startsWith('.')) {
        try {
          console.log('script loading detected')
          const scriptName = detail.match(/^\.(\S+)/)[1]; // todo: ensure match exists before extracting it
          const scriptPath = path.join(__dirname, 'scripts', scriptName + '.js')
          // todo: validate path exists
          delete require.cache[scriptPath]
          script = new Worker(scriptPath, { globals })
          script.on('error', () => console.log('script error! aborting?!'))
          // todo: allow multiple messages
          script.on('message', message => sendCommand(message))
          script.on('exit', () => console.log('script exited!'))
          // initialize script with all global values:
          script.postMessage({xml: true, detail: 'all', globals})
        } catch (err) {
          console.error('Script error:', err)
        }
      } else if (detail.startsWith('#script abort')) {
        console.log('abort event')
        script.terminate()
      }
    } else if (event === 'text') {
      // todo: why would we have text without detail here?
      if (script && detail) script.postMessage({text: detail}) // must be passed as array or object
      // console.log('loadscript received text from game, not handled yet')
    } else if (event === 'xml') {
      if (script) script.postMessage({xml: true, detail, globals})
      // console.log('loadscript received xml from game, not handled yet') todo: deal with this once text is working
    } else {
      console.log('loadscript received unknown event from game, wtf?', command)
    }
  }
}




/*
NEXT STEPS:

detect #abort and kill all scripts
detect .scriptname and run a script
  - when loaded, detect presence of each function (perhaps don't require function though, some scripts might not care about xml events)

parse events in individual functions here
*/


// function oldLoadScript(name, sendCommand) {
//   console.log('attempting to load script:', name);

//   function parseText(text) {
//     console.log('script received', text)
//     if (text.includes('sit')) {
//       return sendCommand('stand')
//     }
//   }
  
//   function parseXML(dataName, value) {
//     // console.log('xml data:', dataName, value)
//     console.log('xml data:', dataName)
//     if (dataName === 'room players') {
//       // return sendCommand('look')
//     }
//   }
  
//   function parseEvent(event) {
//     console.log('*** parseEvent inside script firing ***', event)
//     console.log('event received:', event)
//     if (event === 'abort') {
//       throw new Error(`*** Aborting script ${name} ***`)
//       // process.exit(0) <- this kills the FE
//     }
//   }

//   async function initializeScript() {
//     sendCommand('info')
//   }

//   return {
//     parseText, parseXML, parseEvent, initializeScript
//   }
// }



module.exports = scriptRunner
