import React, { Component } from 'react'

export default class CommandInput extends Component {
  state = {
    cmdHistory: [],
    cmdIndex: 0,
    currentCommand: ""
  }

  componentDidMount() {
    this.refs.commandInput.focus()
  }

  addCommandToHistory = command => {
    const { cmdHistory } = this.state
    // Don't add repeat commands:
    if (command === cmdHistory[cmdHistory.length - 1]) return
    cmdHistory.push(command)
    this.setState({ cmdIndex: cmdHistory.length - 1, cmdHistory })
  }

  enterCommand = () => {
    // Saves command to history before sending
    const command = this.state.currentCommand
    this.addCommandToHistory(command)
    this.props.sendCommand(command)
    setTimeout(() => {
      console.log(this.state.cmdIndex, this.state.cmdHistory)
    }, 100)
  }

  getPrevCmd = () => {
    const { cmdHistory, cmdIndex } = this.state;
    if (cmdHistory[cmdIndex - 1]) {
      const prevCommand = cmdHistory[cmdIndex - 1]
      this.setState({ currentCommand: prevCommand, cmdIndex: cmdIndex - 1 })
    }
  }

  getNextCmd = () => {
    const { cmdHistory, cmdIndex } = this.state;
    if (cmdHistory[cmdIndex + 1]) {
      const nextCmd = cmdHistory[cmdIndex + 1]
      this.setState({ currentCommand: nextCmd, cmdIndex: cmdIndex + 1 })
    } else {
      // Clear the input
      this.setState({ currentCommand: "", cmdIndex: cmdIndex + 1 })
    }
  }

  handleChange = newText => {
    this.setState({ currentCommand: newText })
  }

  handleKeyPress = e => {
    const { key, keyCode } = e
    if (key === "Enter") {
      this.refs.commandInput.select()
      return this.enterCommand()
    }
    if (e.key === 'ArrowUp') {
      // Keep cursor at end of input:
      e.preventDefault()
      return this.getPrevCmd()
    }
    if (e.key === 'ArrowDown') {
      return this.getNextCmd()
    }

    if ((keyCode >= 96 && keyCode <= 105) || keyCode === 110) {
      e.preventDefault()
      e.stopPropagation()
      switch (keyCode) {
        case 104:
          return this.props.sendCommand('north')
        case 105:
          return this.props.sendCommand('northeast')
        case 102:
          return this.props.sendCommand('east')
        case 99:
          return this.props.sendCommand('southeast')
        case 98:
          return this.props.sendCommand('south')
        case 97:
          return this.props.sendCommand('southwest')
        case 100:
          return this.props.sendCommand('west')
        case 103:
          return this.props.sendCommand('northwest')
        case 101:
          return this.props.sendCommand('out')
        case 110:
          return this.props.sendCommand('up')
        case 96:
          return this.props.sendCommand('down')
        default:
          return
      }
    }
  }

  render() {
    return (
      <div>
        <input style={{ width: "90%"}} type="text" value={this.state.currentCommand} onChange={e => this.handleChange(e.target.value)} onKeyDown={this.handleKeyPress} ref="commandInput" />
      </div>
    )
  }
}
