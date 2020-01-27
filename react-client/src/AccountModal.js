import React, { Component } from 'react'

const modalStyle = {
  background: "white",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 100,
  border: "1px solid rgba(0, 0, 0, 0.5)",
  backgroundColor: "rgba(0, 0, 0, 0.15)",
  // borderRadius: 3,
  padding: 10
}

const instanceList = ["DR", "DRF", "DRX"]

export default class AccountModal extends Component {
  state = {
    account: "",
    password: "",
    instance: "",
    characterName: ""
  }

  handleChange = (field, value) => {
    const newState = {}
    newState[field] = field === "account" ? value.trim().toUpperCase() : value.trim()
    this.setState(newState)
  }

  allFieldsValid = () => {
    return true // below disabled for now until I actually parse the values sent
    // const minFieldLength = 3
    // if (!(this.state.account && this.state.account.length >= minFieldLength)) return false
    // if (!(this.state.password && this.state.password.length >= minFieldLength)) return false
    // if (!this.state.instance) return false
    // if (!(this.state.characterName && this.state.characterName.length >= minFieldLength)) return false
    // return true
  }

  sendConnect = () => {
    const { account, password, instance, characterName } = this.state
    this.props.sendCommand(`#connect ${account} ${password} ${instance} ${characterName}`)
    this.props.closeConnectModal()
  }

  render() {
    return (
      <div style={modalStyle}>
        <div style={{ position: "relative" }}>
          <button style={{ position: "fixed", right: 20, padding: "0 0.25rem" }} type="button" onClick={this.props.closeConnectModal}>x</button>
          <form style={{ paddingTop: "2rem" }}>
            <div className="form-group">
              <label htmlFor="account">Account Name:</label>
              <input type="text" id="account" value={this.state.account} onChange={e => this.handleChange("account", e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" value={this.state.password} onChange={e => this.handleChange("password", e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="instance" >Instance:</label>
              <select id="instance" value={this.state.instance} onChange={e => this.handleChange("instance", e.target.value)}>
                <option value=""></option>
                {instanceList.map(instance => (
                  <option value={instance} key={instance}>{instance}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="character">Character:</label>
              <input type="text" id="character" value={this.state.characterName} onChange={e => this.handleChange("characterName", e.target.value)} />
            </div>
            <button style={{ visibility: this.allFieldsValid() ? "visible" : "hidden" }} type="button" onClick={this.sendConnect}>Connect</button>
          </form>
        </div>
      </div>
    )
  }
}