import React from 'react'

export default function Exp({ exp, sendCommand }) {
  return (
    <div className="monospace">
      <h2>Exp:</h2>
      <table style={{ width: "100%" }}>
        <tbody>
          {Object.keys(exp).map(skill => <ExpItem key={exp[skill].displayName} skill={exp[skill]} sendCommand={sendCommand} />)}
        </tbody>
      </table>
    </div>
  )
}

function ExpItem({ skill, sendCommand }) {
  const { displayName, rank, rate } = skill;
  // rateWord also available in skill
  if (rate === 0) return null;
  return (
    <tr onClick={() => sendCommand(`exp ${displayName}`)}>
      <td>{displayName}</td>
      <td style={{ textAlign: "right" }}>{parseFloat(rank).toFixed(2)}</td>
      <td>{rate.toString().padStart(2, '0')}/34</td>
    </tr>
  )
}