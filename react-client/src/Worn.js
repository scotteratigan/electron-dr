import React from 'react'

export default function Worn({ worn: items }) {
  return (
    <div>
      <h2>Wearing:</h2>
      {items.map(item => <WornItem key={item} item={item} />)}
    </div>
  )
}

function WornItem({ item }) {
  return (<div>{item}</div>)
}