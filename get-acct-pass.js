const { AES, enc } = require('crypto-js');
const { readJsonData } = require('./json-io');
// This function was moved from save-config.js to avoid a circular dependency with sge.js

const ACCT_FILENAME = 'accounts.json'

async function getAcctPass(account) {
  if (!account) {
    throw new Error('Must supply account name!')
  }
  account = account.toUpperCase()
  const savedAccountData = await readJsonData(ACCT_FILENAME)
  const encryptedPass = savedAccountData[account]
  if (!encryptedPass) {
    // throw new Error(`No saved password found for account ${account}`)
    return ''
  }
  const password = AES.decrypt(encryptedPass, 'secret key 123').toString(enc.Utf8)
  return password // AES.decrypt returns this as a promise, so no need to wrap entire function
}

module.exports = { getAcctPass }