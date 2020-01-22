import React from 'react';
import CommandInput from './CommandInput'
import './App.css'
// import { List } from "react-virtualized";
import GameWindow from "./GameWindow"

class App extends React.Component {

  state = {
    gameText: [],
    connected: false
  }

  componentDidMount() {
    window.ipcRenderer.on('message', (event, message) => {
      const { detail, type } = message
      if (type === "gametext") {
        return this.addGameText(detail)
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
      <div className="App">
        <div style={{ height: "90vh" }}>
          <GameWindow gameText={this.state.gameText} />
        </div>
        <CommandInput sendCommand={this.sendCommand} />
      </div >
    );
  }
}

export default App;
