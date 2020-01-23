import React from 'react';
import CommandInput from './CommandInput'
import Exp from "./Exp"
import Stowed from "./Stowed"
import Worn from "./Worn"
import './App.css'
import GameWindow from "./GameWindow"

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
    worn: []
  }

  componentDidMount() {
    window.ipcRenderer.on('message', (event, message) => {
      const { detail, type } = message

      if (this.state.isHotReload && type !== "gametext" && message.globals && Object.keys(message.globals).length > 0) {
        // sets all globals (except gameText), forcing a rerender of all xml objects
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
          setTimeout(() => console.log(this.state), 500)
          return this.setState({ worn: globals.worn })
      }
      console.log(message)
    })
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

  render() {
    return (
      <div className="App" style={{ display: "flex" }}>
        <div className="left-column">
          <Exp exp={this.state.exp} />
          <Stowed stowed={this.state.stowed} />
          <Worn worn={this.state.worn} />
        </div>
        <div className="main-column">
          <div style={{ height: "90vh" }}>
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
          </div>

        </div>
        <div className="right-column">
          Right<br />
          Column
        </div>


      </div >
    );
  }
}

export default App;
