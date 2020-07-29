
function loadScript(name, sendCommand) {
  console.log('attempting to load script:', name);

  function parseText(text) {
    console.log('script received', text)
    if (text.includes('sit')) {
      return sendCommand('stand')
    }
  }
  
  function parseXML(dataName, value) {
    // console.log('xml data:', dataName, value)
    console.log('xml data:', dataName)
    if (dataName === 'room players') {
      // return sendCommand('look')
    }
  }
  
  function parseEvent(event) {
    console.log('*** parseEvent inside script firing ***', event)
    console.log('event received:', event)
    if (event === 'abort') {
      throw new Error(`*** Aborting script ${name} ***`)
      // process.exit(0) <- this kills the FE
    }
  }

  async function initializeScript() {
    sendCommand('info')
    // setInterval(() => {
    //   sendCommand('enc')
    // }, 5000)
  }

  return {
    parseText, parseXML, parseEvent, initializeScript
  }
}



module.exports = loadScript
