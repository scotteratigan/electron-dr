import React from 'react'

const KeyboardContext = React.createContext({
  altKey: false,
  ctrlKey: false,
  shiftKey: false,
  metaKey: false
})

export const KeyboardProvider = KeyboardContext.Provider
export const KeyboardConsumer = KeyboardContext.Consumer
export default KeyboardContext