import React, { useContext } from 'react'
import { getObjNoun } from './utils'
import KeyboardContext from './KeyboardContext'

export default function Worn({ worn: items, sendCommand }) {
  const activeKeys = useContext(KeyboardContext)
  return (
    <div className="panel-window">
        <h2>Wearing {items.length} items:</h2>
        <div className="panel-window-content">
          {items.map(item => <WornItem key={item} item={item} sendCommand={sendCommand} activeKeys={activeKeys} />)}
        </div>
    </div>
  )
}

function WornItem({ item, sendCommand, activeKeys }) {
  return (<div className="clickable" onClick={() => handleWornItemClick(item, sendCommand, activeKeys)}>{item}</div>)
}

function handleWornItemClick(item, sendCommand, activeKeys) {
  const { ctrlKey } = activeKeys
  const itemNoun = getObjNoun(item)
  sendCommand(`remove my ${itemNoun}`)
  if (ctrlKey) {
    setTimeout(() => sendCommand(`stow my ${itemNoun}`), 0)
  }
}