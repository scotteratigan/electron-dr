import React from 'react'

export default function Hand({ whichHand, heldItem }) {
  const { id, item, noun } = heldItem;
  return (
    <div>
      {whichHand} hand: {item}
    </div>
  )
}
