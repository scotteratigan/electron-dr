const expLookup = {
  clear: 0,
  dabbling: 1,
  perusing: 2,
  learning: 3,
  thoughtful: 4,
  thinking: 5,
  considering: 6,
  pondering: 7,
  ruminating: 8,
  concentrating: 9,
  attentive: 10,
  deliberative: 11,
  interested: 12,
  examining: 13,
  understanding: 14,
  absorbing: 15,
  intrigued: 16,
  scrutinizing: 17,
  analyzing: 18,
  studious: 19,
  focused: 20,
  'very focused': 21,
  engaged: 22,
  'very engaged': 23,
  cogitating: 24,
  fascinated: 25,
  captivated: 26,
  engrossed: 27,
  riveted: 28,
  'very riveted': 29,
  rapt: 30,
  'very rapt': 31,
  enthralled: 32,
  'nearly locked': 33,
  'mind lock': 34,
}

function parseExp(str, globals, xmlUpdateEvent) {
  const newSkillRegex = /<component id='exp ([^']+)'>.*<\/component>/g
  let m
  do {
    m = newSkillRegex.exec(str)
    if (m) {
      const displayName = m[1]
      const skillsMatch = m[0].match(/<component id='exp ([^']+)'>[^\d]+(\d+) (\d\d)% (\w+|\w+ \w+)\s+</)
      const skill = formatSkillName(displayName)
      if (!globals.exp[skill]) {
        globals.exp[skill] = {
          rank: 0,
          rate: 0,
          rateWord: "clear",
          displayName,
          displayStr: '' // consider actually formatting this to allow clear skills to display?
        }
      }
      if (!skillsMatch) {
        globals.exp[skill].rate = 0;
        globals.exp[skill].rateWord = "clear";
      } else {
        const rank = parseFloat(skillsMatch[2] + '.' + skillsMatch[3])
        const rateWord = skillsMatch[4]
        const rate = expLookup[rateWord]
        const displayStr = `${displayName.padStart(16, ' ')}: ${(
          skillsMatch[2] +
          '.' +
          skillsMatch[3]
        ).padStart(7, ' ')}% ${rate.toString().padStart(2, ' ')}/34`
        globals.exp[skill] = {
          rank,
          rate,
          rateWord,
          displayName,
          displayStr,
        }
      }
    }
  } while (m)
  xmlUpdateEvent('experience')
}

const str =
  `<component id='exp Offhand Weapon'></component>
<component id='exp Melee Mastery'></component>
<component id='exp Missile Mastery'></component>
<component id='exp Holy Magic'></component>
<component id='exp Attunement'>      Attunement:   19 82% thinking     </component>
<component id='exp Arcana'></component>
<component id='exp Targeted Magic'></component>
<component id='exp Augmentation'></component>
<component id='exp Debilitation'></component>
`
const globals = { exp: {} }
parseExp(str, globals, () => { })
console.log(globals)

function formatSkillName(str) {
  // "Medium Edged" returns "mediumEdged"
  return str.substring(0, 1).toLowerCase() + str.substring(1).replace(' ', '')
}