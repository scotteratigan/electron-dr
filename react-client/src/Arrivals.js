import React, { useEffect, useRef } from 'react'
import { getPlayerName } from './utils'

// arrivals:
// {
//   text: Harnus returns home from a hard day of adventuring.
//   time: 2020-01-25T22:36:07.919Z
// }

export default function Arrivals({ arrivals, sendCommand }) {

  const arrivalsEndRef = useRef(null)

  const scrollToBottom = () => arrivalsEndRef.current.scrollIntoView()

  useEffect(scrollToBottom, [arrivals]);

  return (
    <div>
      <h3>Arrivals</h3>
      <div style={{ height: 200, overflowY: "auto" }}>
        <table>
          <thead>
            <tr>
              <td>Text</td>
              <td>Time</td>
            </tr>
          </thead>
          <tbody>
            {arrivals.map((arrival, i) => (
              <Arrival key={i} arrival={arrival} sendCommand={sendCommand} />
            ))}
          </tbody>
        </table>
        <div ref={arrivalsEndRef} />
      </div>
    </div>
  )
}

function Arrival({ arrival, sendCommand }) {
  const { text, time } = arrival
  const playerNameAndTitle = extractPlayerNameAndTitleFromLoginStr(text)
  const playerName = getPlayerName(playerNameAndTitle)
  const arrivalDateTime = new Date(time)
  const clickable = playerName.length ? true : false
  return (
    <tr>
      <td className={clickable ? "clickable" : "unavailable"} onClick={() => { clickable && sendCommand(`profile ${playerName}`) }}>
        {text}
      </td>
      <td nowrap="true">{arrivalDateTime.toLocaleDateString('en-us', { hc: "h24", timeStyle: "short" })}</td>
    </tr>
  )
}

const arrivalsList = [
  { regex: /(.+) joins the adventure/, arrival: true },
  { regex: /(.+) returns home from a hard day of adventuring/, arrival: false },
  { regex: /(.+) has disconnected/, arrival: false },
  { regex: /(.+) just popped into existence/, arrival: true },
  { regex: /(.+) just crawled into the adventure/, arrival: true },
  { regex: /(.+) just ceased to exist/, arrival: false },
  { regex: /(.+) just went home to take a nap/, arrival: false },
  { regex: /(.+) just limped in for another adventure/, arrival: true },
  { regex: /(.+) just woke up from a nap, ready to join the adventure once again/, arrival: true },
  { regex: /(.+) has woken up in search of new ale/, arrival: true },
  { regex: /(.+) comes out from within the shadows with renewed vigor/, arrival: true },
  { regex: /(.+) just found a shadow to hide out in./, arrival: false },
  { regex: /(.+) fades swiftly into the shadows/, arrival: false },
  { regex: /(.+) away \w+ lockpicks and departs the adventure/, arrival: false },
  { regex: /(.+) retires from the lands to enjoy a nice long catnap/, arrival: false },
  { regex: /(.+) departs from the adventure with little fanfare/, arrival: false },
  { regex: /(.+) limped away from the adventure for now/, arrival: false },
  { regex: /(.+) has left to contemplate the life of a warrior/, arrival: false },
  { regex: /(.+) retires from the adventure for now/, arrival: false },
  { regex: /(.+) just wandered into another adventure/, arrival: false },
  { regex: /(.+) snuck out of the shadow \w+ was hiding in/, arrival: true },
  { regex: /(.+) has joined the adventure after escaping another/, arrival: true },
  { regex: /After waking from a long catnap, (.+) once again prowls the lands/, arrival: false },
  { regex: /The mournful cry of a battle horn sounds as (.+) heads off toward home/, arrival: false },
  { regex: /A lone bell tolls faintly in the distance, waning into silence as (.+) retires to the shadows/, arrival: true },
  { regex: /The ring of a battle horn echoes across the area heralding the arrival of (.+)\./, arrival: true },
  { regex: /A distant whistle signals (.+)'s departure from the adventure/, arrival: false },
]

function extractPlayerNameAndTitleFromLoginStr(str) {
  for (let i = 0; i < arrivalsList.length; i++) {
    const logOnMatch = str.match(arrivalsList[i].regex)
    if (logOnMatch) return logOnMatch[1]
  }
  return ""
}