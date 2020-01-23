import React from 'react'

// todo: show tooltip explaining minutes remaining on hover
// todo: apply color to spells that are fading

export default function Spells({ activeSpells }) {
  console.log(activeSpells)
  return (
    <div>
      <h2>Active Spells:</h2>
      <table>
        <thead>
          <tr>
            <td>Spell Name</td>
            <td>Mins</td>
          </tr>
        </thead>
        <tbody>
          {Object.keys(activeSpells).map(spellName => (
            <SpellDisplay key={spellName} name={spellName} remaining={activeSpells[spellName]} />
            // <div key={spellName}>{spellName}: {activeSpells[spellName]}</div>
          ))}
        </tbody>
      </table>

    </div>
  )
}

function SpellDisplay({ name, remaining }) {
  return (
    <tr>
      <td>{name}</td>
      <td>{remaining}</td>
    </tr>
  )
}