

function setupXMLparser(globals, globalUpdated) {
  console.log('XML version loaded: 5');
  return function parseXML(str) {

    if (str.startsWith("<component id='exp")) {
      parseExp(str, globals, globalUpdated);
    }

  }
}

function parseExp(str, globals, globalUpdated) {
  const lines = str.split("\n");
  lines.forEach(line => {
    let expType = "pulse";
    if (line.includes("whisper")) {
      line = line.replace(/<preset id='whisper'>/, "").replace(/<\/preset>/, "");
      expType = "gain";
    }
    // <component id='exp Chain Armor'>     Chain Armor:    5 62% analyzing    </component>
    const expMatch = line.match(/<component id='exp ([\w ]+)'>.+:\s+(\d+) (\d\d)% (.+)\s*<\/component>/);
    if (!expMatch) return
    try {
      const skill = formatSkillName(expMatch[1]);
      const rank = parseFloat(expMatch[2] + "." + expMatch[3]);
      const rateWord = expMatch[4].trim();
      globalUpdated(expType, skill);
      console.log('Skill:', skill);
      console.log('rank:', rank);
      console.log('rate:', rateWord);
      if (!globals.exp[skill]) globals.exp[skill] = {};
      globals.exp[skill].rank = rank;
      globals.exp[skill].rateWord = rateWord;
    } catch (err) {
      console.error("Error parsing exp:", err);
    }
  });
}

function formatSkillName(str) {
  // "Medium Edged" returns "mediumEdged"
  return str.substring(0, 1).toLowerCase() + str.substring(1).replace(" ", "");
}

module.exports = setupXMLparser;