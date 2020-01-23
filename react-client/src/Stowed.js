import React from 'react'

// todo: add sorts

export default function Stowed({ stowed }) {
  const { containerName, items, uniqueItems } = stowed;
  console.log(containerName, items, uniqueItems)
  // return null
  const uniqueItemKeys = Object.keys(uniqueItems)
  return (
    <div>
      <h2>In the {containerName}</h2>
      <h3>{items.length} items, {uniqueItemKeys.length} unique</h3>
      <table style={{ width: "100%" }}>
        <tbody>
          {uniqueItemKeys.map(itemKey => <StowItem key={itemKey} name={itemKey} qty={uniqueItems[itemKey]} />)}
        </tbody>
      </table>
    </div>
  )
}

function StowItem({ name, qty }) {
  return (
    <tr>
      <td>{name}</td>
      <td style={{ textAlign: "right" }}>{qty > 1 ? qty : ""}</td>
    </tr>
  )
}