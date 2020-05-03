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

// gameCode or instance are used interchangably - represents the game you wish to join (DR, DRF, DRX)

// todo: updated saved character list for that account/instance any time we log in
const net = require('net')
const { getAcctPass } = require('./get-acct-pass')
const SGE_URL = 'eaccess.play.net'
const SGE_PORT = 7900

const validGameCodes = ['DR', 'DRD', 'DRF', 'DRT', 'DRX', 'GS3', 'GS4D', 'GSF', 'GST', 'GSX']

function sgeValidate({ account, password = '', gameCode = '', characterName = '' }) {
  // If invoked with account and password, validates returns '' if validation succeeds, or 'NORECORD', 'PASSWORD' or whatever auth error is
  // If invoked with gameCode in addition to account and password, returns a list of characters for that account/instance
  // If invoked with account, gameCode, and characterName, returns connect key (note: password not required - will look up from file)
  if (gameCode && !validGameCodes.includes(gameCode)) {
    throw new Error(`Invalid gameCode supplied: '${gameCode}'`)
  }

  return new Promise(async (resolve, reject) => {
    let attemptedValidation = false
    let response = { success: false }
    if (gameCode) response[gameCode] = {}

    if (!password) {
      // attempt to load password from file:
      password = await getAcctPass(account)
      console.log('password loaded from file as:', password)
      // todo: handle case where password still blank because it couldn't be loaded
    }

    console.log('creating socket...')
    const sgeClient = new net.Socket()

    sgeClient.connect(SGE_PORT, SGE_URL, res => {
      console.log(`Connected to ${SGE_URL}:${SGE_PORT}`)
      sgeClient.write('K\n')
    })
  
    sgeClient.on('data', data => {
      console.log('data:', data.toString())
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
          if (!gameCode) {
            sgeClient.destroy()
            return resolve('');
          } else {
            return sgeClient.write('M\n')
          }
        } else {
          const authFailReason = text.replace(/^A\s+/, '')
          sgeClient.destroy()
          return resolve(authFailReason)
        }
      }

      if (text.startsWith('M')) {
        sgeClient.write(`N\t${gameCode}\n`)
      }

      if (text.startsWith('N')) {
        console.log('Game Versions:\n', text)
        // G PRODUCTION|STORM|TRIAL
        sgeClient.write(`G\t${gameCode}\n`) // wait, shouldn't we send 'STORM' here?
        return
      }

      if (text.startsWith('G')) {
        console.log('Game Info:\n', text)
        //  G      DragonRealms    FREE_TO_PLAY    0               ROOT=sgc/dr     MKTG=info/default.htm   MAIN=main/default.htm   GAMEINFO=information/default.htm        PLAYINFO=main/default.htm       MSGBRD=message/default.htm      CHAT=chat/default.htm   FILES=files/default.htm COMMING=main/default.htm STUFF=main/comingsoon.htm       BILLINGFAQ=account/default.htm  BILLINGOPTIONS=offer/payment.htm        LTSIGNUP=https://account.play.net/simunet_private/cc-signup.cgi BILLINGINFO=http://account.play.net/simunet_private/acctInfo.cgi?key={KEY}&SITE=sgc     GAMES=main/games.htm    FEEDBACK=feedback/default.htm    MAILFAIL=/sgc/dr/feedback/mailfail.htm  MAILSUCC=/sgc/dr/feedback/mailsent.htm  MAILSERVE=SGC   SIGNUP=http://ad-track.play.net/sgc/signup_redirect.cgi SIGNUPA=http://ad-track.play.net/sgc/signup_again.cgi
        const gameInfo = text.split('\t')
        response[gameCode].accountType = gameInfo[2]
        sgeClient.write('C\n')
        return
      }

      if (text.startsWith('C')) {
        // Todo: determine what these numbers mean:
        // C       1       1       0       0       W_DRNODER_000   Kruarnode
        console.log('characterInfo:')
        console.log(text)
        if (characterName == '') {
          const characterInfo = text.split('\t')
          response[gameCode].slotsUsed = parseInt(characterInfo[1])
          response[gameCode].slotsTotal = parseInt(characterInfo[2])
          const charactersInfo = characterInfo.splice(5) // W_DRNODER_000   Kruarnode
          const characterList = []
          for(let i = 0; i < charactersInfo.length; i += 2) {
            const slotCode = charactersInfo[i]
            const name = charactersInfo[i+1].trim().replace('\n', '')
            characterList.push({ name, slotCode })
          }
          response[gameCode].characterList = characterList
          sgeClient.destroy()
          return resolve({ ...response, success: true })
        } else {
          // determine slotName based on charName
          // create slot lookup
          accountList = text.trim().split('\t').slice(5)
          let charSlotNames = {}
          for (let i = 0; i < accountList.length; i += 2) {
            charSlotNames[accountList[i + 1]] = accountList[i]
          }
          characterName = formatCharacterName(characterName)
          console.log('characterName:', characterName)
          console.log('charSlotNames:', charSlotNames)
          const slotName = charSlotNames[characterName]
          console.log('slotName:', slotName)
          return sgeClient.write(`L\t${slotName}\tSTORM\n`)
        }
      }

      if (text.startsWith('L')) {
        connectKey = text.match(/KEY=(\S+)/)[1]
        connectIP = text.match(/GAMEHOST=(\S+)/)[1]
        connectPort = text.match(/GAMEPORT=(\d+)/)[1]
        console.log('Connect key captured as:', connectKey)
        sgeClient.destroy()
        // todo: also return port and ip right? need to capture above
        return resolve({ ...response, connectKey, connectIP, connectPort, success: true })
      }

      // If we get here, we have a problem...
      console.error('\n\n*******************************\n\n')
      console.error(' Error - unknown text received:')
      console.error(text)
      console.error('\n\n*******************************\n\n')

    })
  })
}

function sendHashedPassword({ account, password, hashKey, sgeClient }) {
  console.log('Sending hashed authentication string.')
  const hashedPassArr = password.split('').map((char, i) => {
    const newVal = hashKey[i] ^ (char.charCodeAt(0) - 32)
    return newVal + 32
  })
  console.log('sending:', `A\t${account}\t`)
  console.log('hashedPassArr:', hashedPassArr.join(''))
  sgeClient.write(`A\t${account}\t`)
  const buffPW = Buffer.from(hashedPassArr) // must be written as a buffer because of invalid ASCII values!
  sgeClient.write(buffPW)
  sgeClient.write('\r\n')
  console.log('password sent')
}

function formatCharacterName(name) {
  // ensures name has first letter uppercase
  const letterArr = name.toLowerCase().split('')
  letterArr[0] = letterArr[0].toUpperCase()
  return letterArr.join('')
}

console.log('sge is exporting', sgeValidate)

module.exports = { sgeValidate }
