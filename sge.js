/*
  based on documentation found here: https://web.archive.org/web/20060728052541/http://www.krakiipedia.org/wiki/SGE_protocol_saved_post
  EAccess-Protocol Documentation (amazing):
  https://github.com/WarlockFE/warlock2/wiki/EAccess-Protocol
  M:
  M       CS      CyberStrike     DR      DragonRealms    DRD     DragonRealms Development        DRF     DragonRealms The Fallen DRT     DragonRealms Prime Test  DRX     DragonRealms Platinum   GS3     GemStone IV     GS4D    GemStone IV Development GSF     GemStone IV Shattered   GST     GemStone IV Prime Test   GSX     GemStone IV Platinum
  P:
  P       CS2     1495    CS.EC   250     CS.EC   200     DR      1495    DR.EC   250     DR.P    2500    DR      1495    DR.EC   250     DR.P    2500     DRF     1995    DRF.EC  250     DR.P    2500    DRT     1495    DRT.EC  250     DRT.P   2500    DRX     1000    DRX.EC  -1      DR.P    2500     GS3     1495    GS3.EC  250     GS3.P   2500    GS3     1495    GS3.EC  250     GS3.P   2500    GSF     -1      GSF.EC  250     GS3.P   2500     GSX     1000    GSX.EC  -1      GS3.P   2500    GSX     1000    GSX.EC  -1      GS3.P   2500
  when attempting login, if account is invalid we get this:
  A               NORECORD
  if account is good but password hash is bad we get this:
  A               PASSWORD
  after too many failed login attempts? :
  A       ACCOUNTNAME  PROBLEM
  */

// todo: capture port and ip for selected (also need to be able to select) game dynamically
const net = require('net')
const SGE_URL = 'eaccess.play.net'
const SGE_PORT = 7900

function accountIsValid({ account, password }) {
  return new Promise((resolve, reject) => {
    let attemptedValidation = false
    const sgeClient = new net.Socket()

    sgeClient.connect(SGE_PORT, SGE_URL, res => {
      console.log(`Connected to ${SGE_URL}:${SGE_PORT}`)
      sgeClient.write('K\n')
    })
  
    sgeClient.on('data', data => {
      // First, send validation if not done yet:
      if (!attemptedValidation) {
        const hashKey = [...data] // hashKey vals can be 64 <= x <= 127
        attemptedValidation = true
        return sendHashedPassword({ account, password, hashKey, sgeClient })
      }

      const text = data.toString()
  
      // Next, check for validation response:
      if (text.startsWith('A')) {
        // A       ACCOUNT KEY     longAlphaNumericString        Subscriber Name
        if (text.includes('KEY')) {
          sgeClient.destroy()
          return resolve(true)
        } else {
          console.error('Authentication failed. Please check USERNAME and PASSWORD.')
          console.error('Response:', text)
          sgeClient.destroy()
          return resolve(false)
        }
      }
    })
  })
}

function getGameKey({ account, password, instance, characterName }, cb) {
  console.log('getGameKey initiated...')
  console.log(account, password, instance, characterName)
  
  let connectKey = null
  let connectIP = null
  let connectPort = null // todo: pass these vals instead of making global
  let attemptedValidation = false
  const sgeClient = new net.Socket()

  sgeClient.connect(SGE_PORT, SGE_URL, res => {
    // todo: add error handling here
    console.log(`Connected to ${SGE_URL}:${SGE_PORT}`)
    sgeClient.write('K\n')
  })

  sgeClient.on('data', data => {
    console.log('DATA:', JSON.stringify(data))
    // First, send validation if not done yet:
    if (!attemptedValidation) {
      const hashKey = [...data] // hashKey vals can be 64 <= x <= 127
      console.log("HASH KEY:", JSON.stringify(hashKey));
      attemptedValidation = true
      return sendHashedPassword({ account, password, hashKey, sgeClient })
    }

    const text = data.toString()

    if (text.startsWith('A')) {
      // A       ACCOUNT KEY     longAlphaNumericString        Subscriber Name
      if (text.includes('KEY')) {
        console.log('Authentication Successful!')
        console.log('text here is:', text) //text.replace(/\t/g, "\n")
        sgeClient.write('M\n')
        return
      } else {
        console.error(
          'Authentication failed. Please check USERNAME and PASSWORD.'
        )
        return
      }
    }
    if (text.startsWith('M')) {
      console.log('Games List:\n', text.replace(/\t/g, '\n'))
      sgeClient.write(`N\t${instance}\n`)
      return
    }
    if (text.startsWith('N')) {
      console.log('Game Versions:\n', text.replace(/\t/g, '\n'))
      sgeClient.write(`G\t${instance}\n`)
      return
    }
    if (text.startsWith('G')) {
      console.log('Game Info:\n', text.replace(/\t/g, '\n'))
      sgeClient.write('C\n')
      return
    }
    if (text.startsWith('C')) {
      accountList = text
        .trim()
        .split('\t')
        .slice(5)
      let charList = [] // not using this right now, but could be useful in the future
      let charSlotNames = {}
      for (let i = 0; i < accountList.length; i += 2) {
        charList.push({ slot: accountList[i], name: accountList[i + 1] })
        charSlotNames[accountList[i + 1]] = accountList[i]
      }
      // grabbing character name from .env file, and ensuring the case is correct:
      const desiredCharacterName = characterName.toLowerCase().split('')
      desiredCharacterName[0] = desiredCharacterName[0].toUpperCase()
      const charName = desiredCharacterName.join('')
      const slotName = charSlotNames[charName]
      console.log('charSlotNames:', charSlotNames)
      console.log('slotName:', slotName)
      sgeClient.write(`L\t${slotName}\tSTORM\n`)
      return
    }
    // Login text: L   OK      UPPORT=5535     GAME=STORM      GAMECODE=DR     FULLGAMENAME=StormFront GAMEFILE=STORMFRONT.EXE GAMEHOST=dr.simutronics.net     GAMEPORT=11324  KEY=a33f64d541ee461cab92a460e149d6d1
    if (text.startsWith('L')) {
      console.log('Login Info:\n', text.replace(/\t/g, '\n'))
      connectKey = text.match(/KEY=(\S+)/)[1]
      connectIP = text.match(/GAMEHOST=(\S+)/)[1]
      connectPort = text.match(/GAMEPORT=(\d+)/)[1]
      console.log('Connect key captured as:', connectKey)
      sgeClient.destroy()
      return
    }
    console.error('\n\n*******************************\n\n')
    console.error(' Error - unknown text received:')
    console.error(text)
    console.error('\n\n*******************************\n\n')
  })

  sgeClient.on('close', function () {
    console.log('SGE connection closed.')
    cb(connectKey, connectIP, connectPort)
  })

  sgeClient.on('error', err => {
    console.error('Error encountered:')
    console.error(err)
  })
}

function sendHashedPassword({ account, password, hashKey, sgeClient }) {
  console.log('Sending hashed authentication string.')
  const hashedPassArr = password.split('').map((char, i) => {
    const newVal = hashKey[i] ^ (char.charCodeAt(0) - 32)
    return newVal + 32
  })
  sgeClient.write(`A\t${account}\t`)
  const buffPW = Buffer.from(hashedPassArr) // must be written as a buffer because of invalid ASCII values!
  sgeClient.write(buffPW)
  sgeClient.write('\r\n')
}

(async () => {
  const valid = await accountIsValid({account: "drnoder", password: "secret"})
  if (valid) {
    console.log('success is my only motherfuckin\' option...')
  } else {
    console.log('vomit on my sweater already, mom\'s spaghetti...')
  }
})()

// (async () => {
//   await getGameKey({ account: 'drnoder', password: 'secret', instance: 'DR', characterName: 'Kruarnode' }, () => console.log('we got that key...'))
// })()

module.exports = getGameKey


