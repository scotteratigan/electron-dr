import React from 'react'
import { Line } from 'rc-progress';

export default function PrepTime({ prepTime, totalPrepTime }) {
  const ptPct = prepTime === 0 ? 0 : prepTime / totalPrepTime * 100
  const color = prepTime > 0 ? "blue" : "rgba(0, 0, 0, 0)"
  return (
    <div style={{ width: 150, display: "flex" }}>
      <span style={{ display: "inline-block", width: 30 }}>{prepTime > 0 ? prepTime : ""}</span>
      <div style={{ width: 120 }}><Line percent={ptPct} strokeWidth="6" strokeColor={color} /></div>
    </div>
  )
}
