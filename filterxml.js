function setupXMLfilter() {
  return function hideXML(str) {
    // login wall-of-text:
    str = str.replace(/<mode id="GAME"\/>.*<\/settings>/g, "");
    // The above is sending 5-6 times, how to prevent? longer pause on connect?
    const spellsMatch = str.match(/^([\s\S\r\n]*)<pushStream id="percWindow"\/>[\w\(\)\d\r\n ]+<popStream\/>([\s\S\r\n]*)$/);
    if (spellsMatch) str = spellsMatch[1] + spellsMatch[2];
    const invMatch = str.match(/<pushStream id='inv'\/>[\s\S\r\n.]+<popStream\/>([\s\S\r\n]*)$/);
    if (invMatch) str = invMatch[1]; // is the prefix here ever relevant?
    str = str.replace(/<clearStream id="percWindow"\/>/, "");
    str = str.replace(/<clearContainer id=.\S+.\/>/, "");
    str = str.replace(/<prompt.*<\/prompt>/, "");
    str = str.replace(/<spell.*<\/spell>/, "");
    str = str.replace(/<prompt time=.\d+.>.*<\/prompt>/, ""); // why is this necessary?
    // <prompt time="1234">blah</prompt>
    str = str.replace(/<component.*\/component>/g, "");
    str = str.replace(/<resource picture="\d+"\/>/, "");
    str = str.replace(/<style id="roomName" \/>/, "");
    str = str.replace(/<style id=""\/>/, "");
    str = str.replace(/<preset id='roomDesc'>/, "");
    str = str.replace(/<\/preset>/, "");
    str = str.replace(/<\/?d>/g, "");
    str = str.replace(/<compass>.*<\/compass>/, "");
    str = str.replace(/<nav\/>/, "");
    str = str.replace(/<streamWindow .+\/>/g, "");
    str = str.replace(/<right.*<\/right>/, "");
    str = str.replace(/<left.*<\/left>/, "");
    str = str.replace(/<inv id=.\S+.>[^<]*<\/inv>/g, "");
    str = str.replace(/<d cmd="\S*">/g, ""); // useful for later, this is a command link
    str = str.replace(/<roundTime value='\d+'\/>/, "");
    str = str.replace(/<dialogData id='minivitals'>[\s\S]+<\/dialogData>/, "");
    str = str.replace(/<castTime value='\d+'\/>/, "");

    // str = str.replace(/<compDef .+<\/compDef>/, ""); // login, sends exp skills
    // str = str.replace(/<mode id="GAME"\/>/, ""); // login, useless...
    // str = str.replace(/<app char="Kruarnode" game="DR" title="[DR: Kruarnode] StormFront"\/>/); // login, could get char name and instance from here
    // str = str.replace(/<exposeContainer id='stow'\/>/); //login...
    // str = str.replace(/<container id='.+' title=".+" target='.+' location='.+' save='.+' resident='.+'\/>/); // login - note this sends ID of stow container? maybe?
    str = str.replace(/^\s*\r?\n/g, ""); // empty lines
    str = str.replace(/^\s*&lt;/, "<"); // beginning of attack
    return str;
  }
}

module.exports = setupXMLfilter;