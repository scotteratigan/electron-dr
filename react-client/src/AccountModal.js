import React, { Component } from 'react'

const modalStyle = {
  background: "white",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 100,
  border: "1px solid black",
  borderRadius: 3,
  padding: 10
}

const instanceList = ["DR", "DRF", "DRX"]

export default class AccountModal extends Component {
  state = {
    account: "",
    password: "",
    instance: "",

  }

  render() {
    return (
      <div style={modalStyle}>
        <form>
          <div>
            <label htmlFor="account">Account Name:</label>
            <input type="text" id="account" />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" />
          </div>
          <div>
            <label htmlFor="instance">Instance:</label>
            <select id="instance">
              <option value=""></option>
              {instanceList.map(instance => (
                <option value="instance" key={instance}>{instance}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="character">Character</label>
            <input type="text" id="character" />
          </div>
        </form>
      </div>
    )
  }
}