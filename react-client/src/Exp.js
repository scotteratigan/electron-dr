import React from 'react'

export default function Exp({ exp }) {
  return (
    <div className="preserve-space monospace">
      <h2>Exp:</h2>
      {Object.keys(exp).map(skill => <ExpItem key={exp[skill].displayName} skill={exp[skill]} />)}
    </div>
  )
}

function ExpItem({ skill }) {
  const { displayStr, rate } = skill;
  // displayName, rank, rateWord also available in skill
  if (rate === 0) return null;
  return (
    <div>{displayStr}</div>
  )
}