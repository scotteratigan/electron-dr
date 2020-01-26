import React from 'react'
import { Line } from 'rc-progress';

export default function RoundTime({ roundTime, totalRoundTime }) {
  const rtPct = roundTime === 0 ? 0 : roundTime / totalRoundTime * 100
  const color = roundTime > 0 ? "red" : "rgba(0, 0, 0, 0)"
  console.log(rtPct)
  return (
    <div style={{ width: 150, display: "flex" }}>
      <span style={{ display: "inline-block", width: 30 }}>{roundTime > 0 ? roundTime : ""}</span>
      <div style={{ width: 120 }}><Line percent={rtPct} strokeWidth="6" strokeColor={color} /></div>
    </div>
  )
}
