// Made all of these filters global because sending two commands simultaneously results in incomplete filtering otherwise
// Probably less performant, but more reliable

function setupXMLfilter() {
  return function hideXML(str) {
    // login wall-of-text:
    str = str.replace(/<mode id="GAME"\/>.*<\/settings>/g, '')
    const spellsMatch = str.match(
      /^([\s\S\r\n]*)<pushStream id="percWindow"\/>[^<]+<popStream\/>([\s\S\r\n]*)$/
    )
    if (spellsMatch) str = spellsMatch[1] + spellsMatch[2]
    str = str.replace(/<inv id='stow'>[^<]*<\/inv>/g, '')
    str = str.replace(/<pushStream id='inv'\/>[^<]*<popStream\/>/gm, '')
    str = str.replace(/<clearStream id='inv' ifClosed='[^']*'\/>/g, '')
    str = str.replace(/<right>[^<]*<\/right>/g, '')
    str = str.replace(/<left>[^<]*<\/left>/g, '')
    str = str.replace(/<clearStream id="percWindow"\/>/g, '')
    str = str.replace(/<clearContainer id=.\S+.\/>/g, '')
    str = str.replace(/<prompt.*<\/prompt>/g, '')
    str = str.replace(/<spell.*<\/spell>/g, '')
    str = str.replace(/<component.*\/component>/g, '')
    str = str.replace(/<resource picture="\d+"\/>/g, '')
    str = str.replace(/<style id="roomName" \/>/g, '')
    str = str.replace(/<style id=""\/>/g, '')
    str = str.replace(/<preset id='roomDesc'>/g, '')
    str = str.replace(/<\/preset>/g, '')
    str = str.replace(/<\/?d>/g, '')
    str = str.replace(/<compass>.*<\/compass>/g, '')
    str = str.replace(/<nav\/>/g, '')
    str = str.replace(/<castTime value='\d+'\/>/g, '')
    str = str.replace(/<streamWindow .+\/>/g, '')
    str = str.replace(/<right.*<\/right>/g, '')
    str = str.replace(/<left.*<\/left>/g, '')
    str = str.replace(/<inv id=.\S+.>[^<]*<\/inv>/g, '')
    str = str.replace(/<d cmd="\S*">/g, '') // useful for later, this is a command link
    str = str.replace(/<roundTime value='\d+'\/>/g, '')
    str = str.replace(/<indicator id="\w+" visible="\w"\/>/g, '')
    str = str.replace(/<dialogData id='minivitals'>[\s\S]+<\/dialogData>/g, '')
    str = str.replace(/<castTime value='\d+'\/>/g, '')
    str = str.replace(/<playerID id='\d+'\/>/g, '')
    str = str.replace(/<settingsInfo[^\/]+instance='\w+'\/>/g, '')
    str = str.replace(/<pushStream id="logons"\/>[^<]*<popStream\/>/g, '')
    str = str.replace(/^\s*$/gm, '') // empty lines
    str = str.replace(/^\s*&lt;/, '<') // beginning of attack
    // console.log('returning str:', str)
    return str
  }
}

module.exports = setupXMLfilter

// <clearContainer id="stow"/>

// <pushStream id="atmospherics"/>The dwalgim on Ysean's crown pulses with a soft light.
// <popStream/>
