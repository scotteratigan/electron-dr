// Issue with initial setup - I can receive two responses in one data event.
// So when I send two commands simultaneously I'm filtering out relevant game text.
// Example: get chest;stow chest
// I think I've fixed it for inventory, but the spells match is potentially problematic

function setupXMLfilter() {
  return function hideXML(str) {
    // login wall-of-text:
    str = str.replace(/<mode id="GAME"\/>.*<\/settings>/g, '')
    const spellsMatch = str.match(
      /^([\s\S\r\n]*)<pushStream id="percWindow"\/>[\w\(\)\d\r\n ]+<popStream\/>([\s\S\r\n]*)$/
    )
    if (spellsMatch) str = spellsMatch[1] + spellsMatch[2]
    str = str.replace(/<inv id='stow'>[^<]*<\/inv>/g, '')
    str = str.replace(/<pushStream id='inv'\/>[^<]*<popStream\/>/gm, '')
    str = str.replace(/<clearStream id='inv' ifClosed='[^']*'\/>/g, '')
    str = str.replace(/<right>[^<]*<\/right>/g, '')
    str = str.replace(/<left>[^<]*<\/left>/g, '')

    str = str.replace(/<clearStream id="percWindow"\/>/, '')
    str = str.replace(/<clearContainer id=.\S+.\/>/g, '')
    str = str.replace(/<prompt.*<\/prompt>/, '')
    str = str.replace(/<spell.*<\/spell>/, '')
    str = str.replace(/<prompt time=.\d+.>.*<\/prompt>/, '') // why is this necessary?
    // <prompt time="1234">blah</prompt>
    str = str.replace(/<component.*\/component>/g, '')
    str = str.replace(/<resource picture="\d+"\/>/, '')
    str = str.replace(/<style id="roomName" \/>/, '')
    str = str.replace(/<style id=""\/>/, '')
    str = str.replace(/<preset id='roomDesc'>/, '')
    str = str.replace(/<\/preset>/, '')
    str = str.replace(/<\/?d>/g, '')
    str = str.replace(/<compass>.*<\/compass>/, '')
    str = str.replace(/<nav\/>/, '')
    str = str.replace(/<streamWindow .+\/>/g, '')
    str = str.replace(/<right.*<\/right>/, '')
    str = str.replace(/<left.*<\/left>/, '')
    str = str.replace(/<inv id=.\S+.>[^<]*<\/inv>/g, '')
    str = str.replace(/<d cmd="\S*">/g, '') // useful for later, this is a command link
    str = str.replace(/<roundTime value='\d+'\/>/, '')
    str = str.replace(/<dialogData id='minivitals'>[\s\S]+<\/dialogData>/, '')
    str = str.replace(/<castTime value='\d+'\/>/, '')
    str = str.replace(/<playerID id='\d+'\/>/, '')
    str = str.replace(/<settingsInfo[^\/]+instance='\w+'\/>/, '')
    str = str.replace(/<pushStream id="logons"\/>[^<]*<popStream\/>/g, '')
    str = str.replace(/^\s*\n$/gm, '') // empty lines
    str = str.replace(/^\s*&lt;/, '<') // beginning of attack
    console.log('returning str:', str)
    return str
  }
}

module.exports = setupXMLfilter

// <clearContainer id="stow"/>

// <pushStream id="atmospherics"/>The dwalgim on Ysean's crown pulses with a soft light.
// <popStream/>
