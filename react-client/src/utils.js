export function getObjNoun(str) {
  str = str.replace(/ (edged|with|entitled|constructed|shaped|capped|carved|set|crafted|worked|fitted) .+/, '')
  const nounMatch = str.match(/(\S+)$/)
  if (nounMatch && nounMatch[1]) return nounMatch[1]
  return str
}

export function getPlayerName(str) {
  str = str.replace(/ (\([^)]+\))$/, '')
  str = str.replace(/ who is .+/, '')
  const nameMatch = str.match(/.+ (\S+)/)
  if (nameMatch && nameMatch[1]) return nameMatch[1]
  return str
}