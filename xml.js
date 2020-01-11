const expLookup = {
  "clear": 0,
  "dabbling": 1,
  "perusing": 2,
  "learning": 3,
  "thoughtful": 4,
  "thinking": 5,
  "considering": 6,
  "pondering": 7,
  "ruminating": 8,
  "concentrating": 9,
  "attentive": 10,
  "deliberative": 11,
  "interested": 12,
  "examining": 13,
  "understanding": 14,
  "absorbing": 15,
  "intrigued": 16,
  "scrutinizing": 17,
  "analyzing": 18,
  "studious": 19,
  "focused": 20,
  "very focused": 21,
  "engaged": 22,
  "very engaged": 23,
  "cogitating": 24,
  "fascinated": 25,
  "captivated": 26,
  "engrossed": 27,
  "riveted": 28,
  "very riveted": 29,
  "rapt": 30,
  "very rapt": 31,
  "enthralled": 32,
  "nearly locked": 33,
  "mind lock": 34
}

function setupXMLparser(globals, globalUpdated) {
  console.log('XML version loaded: 8');
  globals.exp = {};
  globals.exits = {};
  console.log('globals reset');
  return function parseXML(str) {
    // First, do multi-line parsing (like inventory)

    // Otherwise, check line by line.
    const lines = str.split("\n");
    lines.forEach(line => {
      if (!line.startsWith("<")) return;
      if (line.startsWith("<component id='exp"))
        return parseExp(line, globals, globalUpdated);
      if (line.startsWith("<component id='room exits"))
        return parseExits(line, globals, globalUpdated);
    });

  }
}

function parseExits(line, globals, globalUpdated) {
  const exits = {};
  const portalMatches = line.match(/<d>(\w+)<\/d>/g);
  // portalMatches: [ '<d>east</d>', '<d>west</d>', '<d>east</d>', '<d>west</d>' ]
  portalMatches.forEach(portalStr => {
    const dirMatch = portalStr.match(/<d>(\w+)<\/d>/);
    if (dirMatch && dirMatch[1]) exits[dirMatch[1]] = true;
  });
  globals.exits = exits;
  globalUpdated("exits");
}

function parseExp(line, globals, globalUpdated) {
  let expType = "pulse";
  if (line.includes("whisper")) {
    line = line.replace(/<preset id='whisper'>/, "").replace(/<\/preset>/, "");
    expType = "gain";
  }
  const expMatch = line.match(/<component id='exp ([\w ]+)'>.+:\s+(\d+) (\d\d)% (.+)\s*<\/component>/);
  if (!expMatch) return
  try {
    const skill = formatSkillName(expMatch[1]);
    const rank = parseFloat(expMatch[2] + "." + expMatch[3]);
    const rateWord = expMatch[4].trim();
    const rate = expLookup[rateWord]
    globalUpdated(expType, skill);
    if (!globals.exp[skill]) globals.exp[skill] = {};
    globals.exp[skill].rank = rank;
    globals.exp[skill].rate = rate;
  } catch (err) {
    console.error("Error parsing exp:", err);
  }
}

function formatSkillName(str) {
  // "Medium Edged" returns "mediumEdged"
  return str.substring(0, 1).toLowerCase() + str.substring(1).replace(" ", "");
}

module.exports = setupXMLparser;