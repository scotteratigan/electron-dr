import React, { useContext } from 'react'
import KeyboardContext from './KeyboardContext'

export default function Hand({ whichHand, heldItem, sendCommand }) {
  const { id, item } = heldItem; // noun also available
  const activeKeys = useContext(KeyboardContext)
  return (
    <div onClick={() => handleHandClick(id, sendCommand, activeKeys)}>
      {whichHand} hand: {item}
    </div>
  )
}

function handleHandClick(id, sendCommand, activeKeys) {
  console.log('*******\n hand.js activeKeys:', activeKeys)
  const { ctrlKey } = activeKeys; // altKey, shiftKey also available
  if (ctrlKey) {
    sendCommand(`wear ${id}`)
  } else {
    sendCommand(`stow ${id}`)
  }
}