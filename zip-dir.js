const archiver = require('archiver')
const fs = require('fs')
const path = require('path')

/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
function zipDirectory(source, outputFileName) {
  const archive = archiver('zip', { zlib: { level: 9 }})
  const stream = fs.createWriteStream(outputFileName)

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(stream)

    stream.on('close', () => {
      resolve()
      console.log(archive.pointer() + ' total bytes');
    })
    archive.finalize()
  })
}

async function zipForDistribution() {
  console.log('Zipping for distribution...')
  const winPromise = zipDirectory(path.join('dist', 'ElectronDR-win32-x64'), path.join('dist', 'electrondr-win32-x64.zip'))
  const linuxPromise = zipDirectory(path.join('dist', 'ElectronDR-linux-x64'), path.join('dist', 'electrondr-linux-x64.zip'))
  await Promise.all([winPromise, linuxPromise])
  console.log('Zipping Completed')
}
zipForDistribution()
