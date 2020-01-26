import React from 'react';
import Modal from 'react-modal';
import CommandInput from './CommandInput'
import Exp from "./Exp"
import Stowed from "./Stowed"
import Worn from "./Worn"
import Hand from "./Hand"
import Spells from "./Spells"
import './App.css'
import GameWindow from "./GameWindow"
import RoomWindow from "./Room"
import Arrivals from "./Arrivals"
import Deaths from "./Deaths"
import RoundTime from "./RoundTime"
import PrepTime from "./PrepTime"
import PreparedSpell from "./PreparedSpell"
import Compass from "./Compass"

import { KeyboardProvider } from './KeyboardContext'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

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
    },
    gameTime: 0,
    roundTime: 0,
    totalRoundTime: 0,
    prepTime: 0,
    totalPrepTime: 0,
    arrivals: [],
    deaths: [],
    preparedSpell: "",
    accountModalIsOpen: false
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

    if (type === "gametext") return this.addGameText(detail)

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
      case "gameTime":
        return this.setState({ gameTime: globals.gameTime })
      case "roundTime":
        return this.setRoundTime(globals)
      case "prepTime":
        return this.setPrepTime(globals)
      case "logOn":
        return this.setState({ arrivals: globals.arrivals })
      case "preparedSpell":
        return this.setState({ preparedSpell: globals.preparedSpell })
      case "deaths":
        console.log('A death, yay!')
        setTimeout(() => console.log(globals.deaths), 0)
        return this.setState({ deaths: globals.deaths })
      case "globals":
        console.log('----------------------')
        console.log(globals)
        console.log('----------------------')
        return
      default:
        break
    }
    console.log("Unhandled:", message)
  }

  setRoundTime = globals => {
    this.setState(prevState => {
      if (prevState.totalRoundTime < globals.roundTime) return ({
        totalRoundTime: globals.roundTime,
        roundTime: globals.roundTime
      })
      return ({
        roundTime: globals.roundTime
      })
    })
  }

  setPrepTime = globals => {
    this.setState(prevState => {
      if (prevState.totalPrepTime < globals.prepTime) return ({
        totalPrepTime: globals.prepTime,
        prepTime: globals.prepTime
      })
      return ({
        prepTime: globals.prepTime
      })
    })
  }

  addGameText = gameString => {
    console.log('gameString is:', gameString)
    // gameString = gameString.replace(/^\s*\r\n/g, "")
    if (gameString.match(/^\s*\r?\n$/)) return
    gameString = gameString.replace(/<pushBold\/>/g, "<strong>")
    gameString = gameString.replace(/<popBold\/>/g, "</strong>")
    gameString = gameString.replace(/<output class="mono"\/>\r?\n?/g, "<span class='monospace'>")
    gameString = gameString.replace(/\r?\n?<output class=""\/>/g, "</span>")
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
    const { keyState, roundTime, totalRoundTime, prepTime, totalPrepTime } = this.state
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
            <div style={{ height: "10vh", overflowY: "auto" }}>
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
              <div style={{ display: "flex" }}>
                <Compass exits={this.state.room.exits} />
                <div>
                  <RoundTime roundTime={roundTime} totalRoundTime={totalRoundTime} />
                  <PrepTime prepTime={prepTime} totalPrepTime={totalPrepTime} />
                  <PreparedSpell preparedSpell={this.state.preparedSpell} />
                </div>
              </div>
            </div>
          </div>
          <div className="right-column">
            <Arrivals arrivals={this.state.arrivals} sendCommand={this.sendCommand} />
            <Deaths deaths={this.state.deaths} sendCommand={this.sendCommand} />
          </div>
        </div >
      </KeyboardProvider>
    );
  }
}

export default App;
