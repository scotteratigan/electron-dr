import React, { useContext } from 'react'
import { getObjNoun } from './utils'
import KeyboardContext from './KeyboardContext'

// todo: add sorts

export default function Stowed({ stowed, sendCommand }) {
  const { containerName, items, uniqueItems } = stowed;
  const uniqueItemKeys = Object.keys(uniqueItems)
  const activeKeys = useContext(KeyboardContext)
  return (
    <div className="panel-window">
      <h2>In the {containerName}</h2>
      {/* <h3>  {items.length} items, {uniqueItemKeys.length} unique</h3> */}
      <h3>{StowTextHeader(items.length, uniqueItemKeys.length)}</h3>
        <div className="panel-window-content">
            <table style={{width: "100%"}}>
                <tbody>
                {uniqueItemKeys.map(itemKey => <StowItem key={itemKey} name={itemKey} qty={uniqueItems[itemKey]}
                                                         sendCommand={sendCommand} activeKeys={activeKeys}/>)}
                </tbody>
            </table>
        </div>
    </div>
  )
}

function StowTextHeader(itemQty, uniqueItemQty) {
  return itemQty === uniqueItemQty ? <span>{itemQty} items</span> : <span>{itemQty} items, {uniqueItemQty} unique</span>
}

function StowItem({ name, qty, sendCommand, activeKeys }) {
  return (
    <tr className="clickable" onClick={() => handleStowItemClick(name, sendCommand, activeKeys)}>
      <td>{name}</td>
      <td style={{ textAlign: "right" }}>{qty > 1 ? qty : ""}</td>
    </tr>
  )
}

function handleStowItemClick(name, sendCommand, activeKeys) {
  const { ctrlKey } = activeKeys; // altKey, shiftKey also available
  const noun = getObjNoun(name)
  sendCommand(`get my ${noun}`)
  if (ctrlKey) {
    setTimeout(() => sendCommand(`wear my ${noun}`), 0)
  }

}