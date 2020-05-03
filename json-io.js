const fs = require('fs');
const path = require('path');
const configDir = 'config'

function ensureConfigDir() {
  return new Promise(async (resolve, reject) => {
    try {
      await fs.promises.access(configDir);
      return resolve()
    } catch (error) {
      try {
        await fs.promises.mkdir(configDir);
        return resolve()
      } catch (error) {
          throw new Error(error)
      }
    }
  })
}

function readJsonData(fileName) {
  return new Promise(async (resolve, reject) => {
    let jsonData = {};
    await ensureConfigDir()
    if (fs.existsSync(path.join(configDir, fileName))) {
      try {
        const rawData = fs.readFileSync(path.join(configDir, fileName))
        // if file isn't empty, parse as JSON:
        if (rawData.toString()) jsonData = JSON.parse(rawData)
        // todo: handle invalid JSON more gracefully
        return resolve(jsonData)
      } catch (error) {
        console.error('Error reading data:', error)
        return reject(error)
      }
    } else {
      return resolve(jsonData)
    }
  });
}

async function writeJsonData(fileName, jsonData) {
  return new Promise((resolve, reject) => {
    try {
      let writeData = JSON.stringify(jsonData, null, 2);
      const filePath = path.join(configDir, fileName)
      fs.writeFileSync(filePath, writeData);
      return resolve()
    } catch (error) {
      console.log('Error writing account info to file:', error)
      return reject(error)
    }
  })
}

module.exports = { readJsonData, writeJsonData }
