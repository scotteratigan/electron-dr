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

function sgeValidate({ account, password = '', gameCode = '', characterName = '', messageFrontEnd = () => {} }) {
  // If invoked with account and password, validates returns '' if validation succeeds, or 'NORECORD', 'PASSWORD' or whatever auth error is
  // If invoked with gameCode in addition to account and password, returns a list of characters for that account/instance
  // If invoked with account, gameCode, and characterName, returns connect key (note: password not required - will look up from file)
  if (gameCode) {
    gameCode = gameCode.toUpperCase()
    if (!validGameCodes.includes(gameCode)) {
      throw new Error(`Invalid gameCode supplied: '${gameCode}'`)
    }
  }
  

  return new Promise(async (resolve, reject) => {
    let attemptedValidation = false
    let response = { success: false }
    if (gameCode) response[gameCode] = {}

    if (!password) {
      // attempt to load password from file:
      password = await getAcctPass(account)
      // todo: handle case where password still blank because it couldn't be loaded
    }

    console.log(`Attempting to connect to ${SGE_URL}:${SGE_PORT}`)
    const sgeClient = new net.Socket()
    const send = makeSender(sgeClient, messageFrontEnd)

    sgeClient.connect(SGE_PORT, SGE_URL, res => {
      console.log(`Connected to ${SGE_URL}:${SGE_PORT}`)
      send('K\n')
    })
  
    sgeClient.on('data', data => {
      const text = data.toString()
      console.log(text)
      messageFrontEnd({
        type: 'gametext',
        detail: text,
      })
      // First, send validation if not done yet:
      if (!attemptedValidation) {
        const hashKey = [...data] // hashKey vals can be 64 <= x <= 127
        attemptedValidation = true
        return sendHashedPassword({ account, password, hashKey, send })
      }

      // Next, respond to SGE prompts, in order:
      if (text.startsWith('A')) {
        // A       ACCOUNT KEY     longAlphaNumericString        Subscriber Name
        if (text.includes('KEY')) {
          if (!gameCode) {
            sgeClient.destroy()
            return resolve('');
          } else {
            // return sgeClient.write('M\n')
            return send('M\n')
          }
        } else {
          const authFailReason = text.replace(/^A\s+/, '')
          sgeClient.destroy()
          return resolve(authFailReason)
        }
      }

      if (text.startsWith('M')) {
        // M       CS      CyberStrike     DR      DragonRealms    DRD     DragonRealms Development        DRF     DragonRealms The Fallen DRT     DragonRealms Prime Test DRX     DragonRealms Platinum   GS3     GemStone IV     GS4D    GemStone IV Development GSF     GemStone IV Shattered   GST     GemStone IV Prime Test  GSX     GemStone IV Platinum
        return send(`N\t${gameCode}\n`)
      }

      if (text.startsWith('N')) {
        // N       PRODUCTION|STORM|TRIAL
        return send(`G\t${gameCode}\n`)
      }

      if (text.startsWith('G')) {
        //  G      DragonRealms    FREE_TO_PLAY    0               ROOT=sgc/dr     MKTG=info/default.htm   MAIN=main/default.htm   GAMEINFO=information/default.htm        PLAYINFO=main/default.htm       MSGBRD=message/default.htm      CHAT=chat/default.htm   FILES=files/default.htm COMMING=main/default.htm STUFF=main/comingsoon.htm       BILLINGFAQ=account/default.htm  BILLINGOPTIONS=offer/payment.htm        LTSIGNUP=https://account.play.net/simunet_private/cc-signup.cgi BILLINGINFO=http://account.play.net/simunet_private/acctInfo.cgi?key={KEY}&SITE=sgc     GAMES=main/games.htm    FEEDBACK=feedback/default.htm    MAILFAIL=/sgc/dr/feedback/mailfail.htm  MAILSUCC=/sgc/dr/feedback/mailsent.htm  MAILSERVE=SGC   SIGNUP=http://ad-track.play.net/sgc/signup_redirect.cgi SIGNUPA=http://ad-track.play.net/sgc/signup_again.cgi
        const gameInfo = text.split('\t')
        response[gameCode].accountType = gameInfo[2]
        return send('C\n')
      }

      if (text.startsWith('C')) {
        // Todo: determine what these numbers mean:
        // C       1       1       0       0       W_DRNODER_000   Kruarnode
        // Slots:  Used    Total   ???     ???
        // Note: f2p account is 0 0 for last 2 nums, TF acct is 1 1
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
          // To create a new slot, I think we need to send a command in the previous step to initiate the new character
          // if (characterName === '-NewChar-') slotName = 'W_DRSCOTT_008' //'-NEWCHAR-'

          // Get slot name from character list
          accountList = text.trim().split('\t').slice(5)
          let charSlotNames = {}
          for (let i = 0; i < accountList.length; i += 2) {
            charSlotNames[accountList[i + 1].toUpperCase()] = accountList[i]
          }
          characterName = characterName.toUpperCase()
          const slotName = charSlotNames[characterName]
          // return send(`L\t${slotName}\tSTORM\n`)
          return send(`L\t${slotName}\tSTORM\n`)
          }
      }

      if (text.startsWith('L')) {
        connectKey = text.match(/KEY=(\S+)/)[1]
        connectIP = text.match(/GAMEHOST=(\S+)/)[1]
        connectPort = text.match(/GAMEPORT=(\d+)/)[1]
        sgeClient.destroy()
        return resolve({ ...response, connectKey, connectIP, connectPort, success: true })
      }

      // If we get here, we have a problem...
      console.error('\n*******************************')
      console.error(' Error - unknown text received:')
      console.error(text)
      console.error('*******************************')

    })
  })
}

function sendHashedPassword({ account, password, hashKey, send }) {
  const hashedPassArr = password.split('').map((char, i) => {
    const newVal = hashKey[i] ^ (char.charCodeAt(0) - 32)
    return newVal + 32
  })
  // Could potentially one-line this as a buffer?
  const buffPW = Buffer.from(hashedPassArr) // must be written as a buffer because of invalid ASCII values!
  send(`A\t${account}\t`)
  send(buffPW) // sending separately because it's a buffer not a string
  send('\r\n')
}

function makeSender(sgeClient, messageFrontEnd) {
  return (data) => {
    console.log('>', data)
    messageFrontEnd({
      type: 'gametext',
      detail: '> ' + data,
    })
    sgeClient.write(data)
  }
}

module.exports = { sgeValidate }
