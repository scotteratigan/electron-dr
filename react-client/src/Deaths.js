import React, { useEffect, useRef } from 'react'

// deaths:
// {
//   text: Harnus was just struck down
//   time: 2020-01-25T22:36:07.919Z
// }

export default function Deaths({ deaths, sendCommand }) {

  const deathsEndRef = useRef(null)

  const scrollToBottom = () => deathsEndRef.current.scrollIntoView()

  useEffect(scrollToBottom, [deaths]);

  return (
    <div>
      <h3>Deaths</h3>
      <div style={{ height: 120, overflowY: "auto" }}>
        <table>
          <thead>
            <tr>
              <td>Text</td>
              <td>Time</td>
            </tr>
          </thead>
          <tbody>
            {deaths.map((death, i) => (
              <Death key={i} death={death} sendCommand={sendCommand} />
            ))}
          </tbody>
        </table>
        <div ref={deathsEndRef} />
      </div>
    </div>
  )
}

function Death({ death, sendCommand }) {
  const { text, time } = death
  const playerName = death.match(/(.+) was just struck down/)[1]
  const deathDateTime = new Date(time)
  const clickable = playerName.length ? true : false
  return (
    <tr>
      <td className={clickable ? "clickable" : "unavailable"} onClick={() => { clickable && sendCommand(`profile ${playerName}`) }}>
        {text}
      </td>
      <td nowrap="true">{deathDateTime.toLocaleDateString('en-us', { hc: "h24", timeStyle: "short" })}</td>
    </tr>
  )
}
