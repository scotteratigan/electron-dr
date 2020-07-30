const { workerData, parentPort } = require('worker_threads')

console.log('*** *** *** SCRIPT LOADING *** *** ***')
console.log('worker data:', workerData)

// parentPort.postMessage({ hello: workerData })

setInterval(() => {
  console.log('sending command from script.js')
  parentPort.postMessage('enc');
}, 4000)