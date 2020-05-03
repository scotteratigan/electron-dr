const { AES } = require('crypto-js');
const { readJsonData, writeJsonData } = require('./json-io');
const { getAcctPass } = require('./get-acct-pass')
const { sgeValidate } = require('./sge');
console.log('getting function type:', sgeValidate)

const ACCT_FILENAME = 'accounts.json'
const CHARS_FILENAME = 'characters.json'

// function getCharactersFromSGE({account, gameCode}) {
//   return new Promise(async (resolve, reject) => {
//     if (!account || !gameCode) {
//       throw new Error('Must supply account and gameCode')
//     }
//     account = account.toUpperCase()
//     gameCode = gameCode.toUpperCase()
//     const password = await getAcctPass(account)
//     const currentCharacterData = await readJsonData(CHARS_FILENAME)
//     const res = await sgeValidate({ account, password, gameCode })
//     if (res.success) {
//       const {success: _, ...newCharacterData} = res
//       const updatedCharacterData = {...currentCharacterData}
//       updatedCharacterData[account] = {...updatedCharacterData[account], ...newCharacterData}
//       await writeJsonData(CHARS_FILENAME, updatedCharacterData)
//       return resolve('Account data updated successfully.')
//     } else {
//       return reject('Authentication failed, cannot get character list.')
//     }
//   })
// }

/**
 * Loads list of characters from local file system, if it exists
 * @returns {Promise<Object>} - Object with keys for each instance
 * @example loadSavedCharacters()
 */
function loadSavedCharacters() {
  return new Promise((async resolve => {
    const characterData = await readJsonData(CHARS_FILENAME)
    return resolve(characterData)
  }))
}

/**
 * Loads list of accounts from local file system, if any
 * @returns {Promise<Object>} - Object with keys for each instance
 * @example loadAccounts('')
 * ['DRNODER', 'DRNODER2']
 */
function loadAccounts() {
  return new Promise((async resolve => {
    const savedAccountData = await readJsonData(ACCT_FILENAME)
    return resolve(Object.keys(savedAccountData))
  }))
}

/**
 * Given an account name, retreives list of characters per instance (dr, drf)
 * @param {string} account - Name of account, not case sensitive
 * @returns {Promise<Object>} returns object with character details, or {} if failure
 * @example updateSavedCharacterList('DRNODER')
 * {
 *   DR: {
 *     accountType: 'FREE_TO_PLAY',
 *     slotsUsed: 1,
 *     slotsTotal: 1,
 *     characterList: [ [Object] ]
 *   }
 * }
 */
function updateSavedCharacterList(account) {
  return new Promise(async (resolve, reject) => {
    if (!account) {
      throw new Error('Must supply account')
    }
    account = account.toUpperCase()
    const characterData = await readJsonData(CHARS_FILENAME)
    const password = await getAcctPass(account)
    if (password === '') {
      return resolve({})
    }
    if (characterData[account] === undefined) characterData[account] = {}
    // for each gameCode, get character list
    // can't have more than 1 simultaneous connection:
    for(const gameCode of ['DR', 'DRF', 'DRX', 'DRT']) {
      console.log('checking', gameCode)
      const res = await sgeValidate({ account, password, gameCode })
      if (res.success) {
        characterData[account][gameCode] = res[gameCode]
      } else {
        // abort if we got an auth error
        console.error('error retreiving character list')
        return reject({})

      }
    }
    await writeJsonData(CHARS_FILENAME, characterData)
    return resolve(characterData[account])
  })
}

/**
 * Attempts to validate account login info, then store in config/accounts.json
 * @param {string} account - Name of account, not case sensitive
 * @param {string} password - Plaintext password, case sensitive
 * @returns {string} 'VALID' if auth succeeds, otherwise err msg like 'NORECORD' or 'PASSWORD'
 * @example addOrUpdateAccount('DRNODER', 'ToPsEcReT')
 */
async function addOrUpdateAccount(account, password) {
  // returns false if account is invalid, otherwise returns true
  if (!account || !password) {
    throw new Error('Must enter both username and password.')
  }
  account = account.toUpperCase()
  try {
    const authError = await sgeValidate({account, password})
    if (authError) {
      // NORECORD - account doesn't exist
      // PASSWORD - password is incorrect
      // ?? - account is locked out
      console.log('authError:', authError)
      return authError
    }
    const encryptedPass = AES.encrypt(password, 'secret key 123').toString();
    const savedAccountData = await readJsonData(ACCT_FILENAME)
    const newAccountData = {...savedAccountData, [account]: encryptedPass}
    await writeJsonData(ACCT_FILENAME, newAccountData)
    
    // now, go ahead and load all characters as well:
    updateSavedCharacterList(account, password)
    return 'VALID'
  } catch (err) {
    console.error('error validating:', err)
  }

}

/**
 * Attempts to remove previously saved account from config/accounts.json
 * @param {string} account - Name of account, not case sensitive
 * @returns {boolean} true if account was removed
 * @example removeAccount('DRNODER')
 */
async function removeAccount(account) {
  // todo: return success or failure
  account = account.toUpperCase()
  const accountData = await readJsonData(ACCT_FILENAME)
  if (!accountData[account]) return false
  delete accountData[account]
  await writeJsonData(ACCT_FILENAME, accountData)
  return true
}

// async function getAcctPass(account) {
//   if (!account) {
//     throw new Error('Must supply account name!')
//   }
//   account = account.toUpperCase()
//   const savedAccountData = await readJsonData(ACCT_FILENAME)
//   const encryptedPass = savedAccountData[account]
//   if (!encryptedPass) {
//     // throw new Error(`No saved password found for account ${account}`)
//     return ''
//   }
//   const password = AES.decrypt(encryptedPass, 'secret key 123').toString(enc.Utf8)
//   return password // AES.decrypt returns this as a promise, so no need to wrap entire function
// }

module.exports = { addOrUpdateAccount, removeAccount, loadAccounts, updateSavedCharacterList, loadSavedCharacters }
