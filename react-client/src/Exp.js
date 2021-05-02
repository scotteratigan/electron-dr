import React from 'react'

export default function Exp({ exp, sendCommand }) {
  return (
    <div className="monospace panel-window">
      <h2>Exp:</h2>
      <div className="panel-window-content">
        <table style={{ width: "100%" }}>
          <tbody>
            {Object.keys(exp).map(skill => <ExpItem key={exp[skill].displayName} skill={exp[skill]} sendCommand={sendCommand} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ExpItem({ skill, sendCommand }) {
  const { displayName, rank, rate } = skill;
  // rateWord also available in skill
  if (rate === 0) return null;
  return (
    <tr>
      <td className="clickable" onClick={() => sendCommand(`exp ${displayName}`)}>{displayName}</td>
      <td style={{ textAlign: "right", "padding-right":"5px" }}>{parseFloat(rank).toFixed(2)}%</td>
      <td>{rate.toString().padStart(2, '0')}/34</td>
    </tr>
  )
}