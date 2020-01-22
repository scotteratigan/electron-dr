import React, { Component } from 'react'

export default class CommandInput extends Component {
  state = {
    commandHistory: [],
    currentCommand: ""
  }

  handleChange = newText => {
    this.setState({ currentCommand: newText })
  }

  handleKeyPress = key => {
    if (key === "Enter") {
      console.log('Todo: send command!')
      this.props.sendCommand(this.state.currentCommand)
    }
    // if (e.key === 'ArrowUp') return retrievePreviousCommand()
    // if (e.key === 'ArrowDown') return retrieveNextCommand()
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.currentCommand} onChange={e => this.handleChange(e.target.value)} onKeyDown={e => this.handleKeyPress(e.key)} />
      </div>
    )
  }
}
