const { workerData, parentPort } = require('worker_threads')
let standTimeout

console.log('*** *** *** SCRIPT LOADING *** *** ***')
console.log('worker data:', workerData)

// triggers, essentially:
parentPort.on('message', (message) => {
  if (message.text) {
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
    console.log('script.js received XML:', detail)
    if (detail === 'all') {
      console.log('initialization received')
    }
    if (globals.bodyPosition !== 'standing') {
      // todo: why is bodyPosition firing 4 times on sit and stand? is it because each global var is sending an update? (kneeling, etc)
      clearTimeout(standTimeout)
      standTimeout = setTimeout(() => {
        parentPort.postMessage('stand');
      }, 50)
    }

    return
  }
})

// actual script part
setInterval(() => {
  console.log('sending command from script.js')
  parentPort.postMessage('enc');
}, 4000)


