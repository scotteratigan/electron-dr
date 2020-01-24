export function getObjNoun(str) {
  const nounMatch = str.match(/(\S+)$/)
  if (nounMatch && nounMatch[1]) return nounMatch[1]
  return str
}