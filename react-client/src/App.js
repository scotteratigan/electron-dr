import React from 'react';
import CommandInput from './CommandInput'

class App extends React.Component {
  state = {
    gameText: []
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
    return this.setState({ gameText: [...this.state.gameText, gameString] })
  }

  sendCommand = str => {
    this.addGameText(">" + str)
    window.ipcRenderer.send('asynchronous-message', str)
  }

  render() {
    return (
      <div className="App">
        <h1>This is my header</h1>
        <div style={{ height: "90vh", overflowY: "auto" }}>
          {this.state.gameText.map((str, i) => <div key={i}>{str}</div>)}
        </div>
        <CommandInput sendCommand={this.sendCommand} />
      </div>
    );
  }
}

export default App;
