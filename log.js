const fs = require('fs')
const path = require('path')

const LOG_DIR = 'logs'
// todo: create log directory if it doesn't exist

async function makeLogger(charName = 'Character', instance = 'UI', logType) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(`./${LOG_DIR}`)) {
      // this is sync but only executed once on bootup - replace with non-sync code later?
      fs.mkdirSync(`./${LOG_DIR}`)
    }
    const now = new Date()
    const dateStr =
      now.getFullYear() +
      '-' +
      (now.getUTCMonth() + 1).toString().padStart(2, '0') +
      '-' +
      now
        .getDate()
        .toString()
        .padStart(2, '0')
    const fileName = [charName, instance, dateStr, logType, 'log.txt'].join('-')
    const fileFullPath = path.resolve(__dirname, LOG_DIR, fileName)
    let logging = false
    fs.open(fileFullPath, 'a', (err, fd) => {
      if (err) console.error('Error setting up log file.')
      logging = true
      let buffer = '' // todo: use actual buffer

      let logInterval = setInterval(writeLogToFile, 1000)

      function log(str) {
        if (!logging)
          return console.error('Error, tried to log after unloading logger!')
        if (!str.endsWith('\r')) str += '\r'
        buffer += str
      }

      function unloadLogger() {
        logging = false
        clearInterval(logInterval)
        writeLogToFile()
        fs.close(fd, () => {
          return resolve()
        })
      }

      function writeLogToFile() {
        if (buffer) {
          fs.appendFile(fd, buffer, err => {
            if (err) console.error('ERROR APPENDING LOG FILE!')
            buffer = ''
          })
        }
      }

      return resolve({ log, unloadLogger })
    })
  })
}

module.exports = makeLogger

// async function setup() {
//   const { log, unloadLogger } = await makeLogger("Kwarnode", "DR")
//   log('test');
//   log('test1');
//   log('test2');
//   log('test3');
//   log('test4');
//   log('test5');
//   unloadLogger();
//   log('testagain');
// }

// setup();
