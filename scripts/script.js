'use strict'
// todo: consider sending in globals as workerData instead of needing to trigger an immediate send of the xml all event
const { /*workerData,*/ parentPort } = require('worker_threads')

console.log('*** script.js loaded ***')
const triggers = {}




function move(cmd) {
  let moved = false
  triggers[move] = text => text.includes("Obvious") ? moved = true : null

}

// triggers, essentially:
parentPort.on('message', (message) => {
  if (message.text) {
    Object.entries(triggers).forEach(triggerFn => triggerFn(text))
    // console.log('script.js received text:', message.text)
    // working trigger example:
    // if (message.text.includes('Kruarnode')) {
    //   parentPort.postMessage('nod')
    // }
    return
  }
  if (message.xml) {
    // the problem is, whem xml is getting updated it isn't sending the detail that's changing
    const {detail, globals} = message;
    // console.log('script.js received XML:', detail)
    if (detail === 'all') console.log('initialization received')
    if (detail === 'bodyPosition' && globals.bodyPosition !== 'standing') {
      parentPort.postMessage('stand')
    }

    return
  }
})

// actual script part
// setInterval(() => {
//   console.log('sending command from script.js')
//   parentPort.postMessage('enc');
// }, 4000)


