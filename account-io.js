const fs = require('fs')
const ACCOUNT_FILE = 'accounts.json'

function readAccountData() {
  return new Promise((resolve, reject) => {
    let accountData = "[]";
    if (fs.existsSync(ACCOUNT_FILE)) {
      try {
        const rawdata = fs.readFileSync(ACCOUNT_FILE)
        accountData = JSON.parse(rawdata)
        return resolve(accountData)
      } catch (error) {
        console.error('Error reading data:', error)
        return reject(error)
      }
    } else {
      return resolve(accountData)
    }
  });
}

async function writeAccountData(newData) {
  return new Promise((resolve, reject) => {
    try {
      let writeData = JSON.stringify(newData);
      fs.writeFileSync(ACCOUNT_FILE, writeData);
      return resolve()
    } catch (error) {
      console.log('Error writing account info to file:', error)
      return reject(error)
    }
  })
}

module.exports = {readAccountData, writeAccountData}


