import React from 'react';
import CommandInput from './CommandInput'
import Exp from "./Exp"
import Stowed from "./Stowed"
import Worn from "./Worn"
import Hand from "./Hand"
import Spells from "./Spells"
import './App.css'
import GameWindow from "./GameWindow"
import RoomWindow from "./Room"

import { KeyboardProvider } from './KeyboardContext'

// todo: on first xml message after load, fire global state change
// this allows faster refreshing of all existing xml after front end change

class App extends React.Component {

  state = {
    isHotReload: true,
    gameText: [""],
    connected: false,
    splitScreen: false,
    exp: {},
    stowed: { items: [], uniqueItems: {}, containerName: "" },
    worn: [],
    rightHand: {
      id: "", item: "", noun: ""
    },
    leftHand: {
      id: "", item: "", noun: ""
    },
    activeSpells: {},
    keyState: {
      altKey: false,
      ctrlKey: false,
      shiftKey: false,
      metaKey: false
    },
    room: {
      description: "",
      exits: [],
      items: [],
      mobs: [],
      monsterCount: 0,
      name: "",
      playersArray: [],
      playersString: ""
      // todo: wtf is room.test?
    }
  }

  componentDidMount() {
    window.ipcRenderer.on('message', (event, message) => {
      this.handleServerMessage(message)
    })
    document.addEventListener('keydown', this.setKeyState)
    document.addEventListener('keyup', this.setKeyState)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.setKeyState)
    document.removeEventListener('keyup', this.setKeyState)
  }

  handleServerMessage = (message) => {
    const { detail, type } = message

    if (this.state.isHotReload && type !== "gametext" && message.globals && Object.keys(message.globals).length > 0) {
      // sets all globals (except gameText), forcing an initial load of all xml objects
      this.setState({ ...message.globals, isHotReload: false })
      // not calling return here in case I add extra logic to individual xml events below
    }

    switch (type) {
      case "gametext":
        return this.addGameText(detail)
    }

    // Following cases need globals var:
    const { globals } = message;
    switch (type) {
      case "experience":
        return this.setState({ exp: globals.exp })
      case "stowed":
        return this.setState({ stowed: globals.stowed })
      case "worn":
        return this.setState({ worn: globals.worn })
      case "hand":
        return this.setState({ rightHand: globals.rightHand, leftHand: globals.leftHand })
      case "activeSpells":
        return this.setState({ activeSpells: globals.activeSpells })
      case "room":
      case "room players":
      case "room objects":
        return this.setState({ room: globals.room })
    }
    console.log("Unhandled:", message)
  }

  addGameText = gameString => {
    gameString = gameString.replace(/^\s*\r\n/g, "")
    if (gameString.match(/^\s*\r?\n$/)) return
    gameString = gameString.replace(/<pushBold\/>/g, "<strong>")
    gameString = gameString.replace(/<popBold\/>/g, "</strong>")
    gameString = gameString.replace(/<output class="mono"\/>/g, "<div class='monospace'>")
    gameString = gameString.replace(/<output class=""\/>/g, "</div>")
    console.log('gameString is:', gameString)
    return this.setState({ gameText: [...this.state.gameText, gameString] })
  }

  sendCommand = str => {
    this.addGameText(">" + str)
    window.ipcRenderer.send('asynchronous-message', str)
  }

  setKeyState = event => {
    const { key } = event
    let keyName
    switch (key) {
      case "Control":
        keyName = "ctrlKey"
        break
      case "Shift":
        keyName = "shiftKey"
        break
      case "Alt":
        keyName = "altKey"
        break
      case "Meta":
        keyName = "metaKey"
        break;
      default:
        return
    }
    const { type } = event
    const value = type === "keydown" ? true : false
    // todo: don't fire multiple events when key is held down
    const newKeyState = { ...this.state.keyState }
    newKeyState[keyName] = value
    this.setState({ keyState: newKeyState })
  }

  render() {
    const { keyState } = this.state
    return (
      <KeyboardProvider value={keyState}>
        <div className="App" style={{ display: "flex" }}>
          <div className="left-column">
            <Exp exp={this.state.exp} sendCommand={this.sendCommand} />
            <Stowed stowed={this.state.stowed} sendCommand={this.sendCommand} />
            <Worn worn={this.state.worn} sendCommand={this.sendCommand} />
            <Spells activeSpells={this.state.activeSpells} sendCommand={this.sendCommand} />
          </div>
          <div className="main-column">
            <div style={{ height: "10vh" }}>
              <RoomWindow room={this.state.room} sendCommand={this.sendCommand} />
            </div>
            <div style={{ height: "80vh" }}>
              {this.state.splitScreen ? (
                <>
                  <div style={{ height: "50%" }}>
                    <GameWindow gameText={this.state.gameText} autoScroll={false} />
                  </div>
                  <div style={{ height: "50%" }}>
                    <GameWindow gameText={this.state.gameText} autoScroll={true} />
                  </div>
                </>
              ) :
                <GameWindow gameText={this.state.gameText} autoScroll={true} />
              }
            </div>
            <div>
              <CommandInput sendCommand={this.sendCommand} />
              <button type="button" onClick={() => this.setState({ splitScreen: !this.state.splitScreen })}>Toggle Split</button>
              <Hand whichHand={"Right"} heldItem={this.state.rightHand} sendCommand={this.sendCommand} />
              <Hand whichHand={"Left"} heldItem={this.state.leftHand} sendCommand={this.sendCommand} />
            </div>
          </div>
          <div className="right-column">
          </div>
        </div >
      </KeyboardProvider>
    );
  }
}

export default App;
