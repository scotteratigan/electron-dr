/*
  This is a fix for the react build script apparently not utilizing the homepage setting in package.json
  Paths referenced by index.html need to be properly relative './static' - '/static' will not work
*/

const fs = require('fs')
const path = require('path')

const filePath = path.join('build', 'index.html')
const htmlStr = fs.readFileSync(filePath, {}).toString().replace(/(src|href)="\/static/g, '$1="./static')
fs.writeFileSync(filePath, htmlStr)
console.log('Paths fixed.')