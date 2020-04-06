import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

const modalStyle = {
  background: "white",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 100,
  border: "1px solid rgba(0, 0, 0, 0.5)",
  backgroundColor: "rgba(0, 0, 0, 0.02)",
  borderRadius: 2,
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
    const minFieldLength = 3
    if (!(this.state.account && this.state.account.length >= minFieldLength)) return false
    if (!(this.state.password && this.state.password.length >= minFieldLength)) return false
    if (!this.state.instance) return false
    if (!(this.state.characterName && this.state.characterName.length >= minFieldLength)) return false
    return true
  }

  sendConnect = () => {
    console.log('sending connect...')
    if (!this.allFieldsValid()) return
    const { account, password, instance, characterName } = this.state
    this.props.sendCommand(`#connect ${account} ${password} ${instance} ${characterName}`)
    this.props.closeConnectModal()
  }

  render() {
    return (
      <div style={modalStyle}>
        <Box>
          <Button style={{ position: "fixed", right: 20 }} type="button" onClick={this.props.closeConnectModal}>x</Button>
          <form style={{ paddingTop: "2rem" }} autoComplete="off">
            <FormControl component="div" fullWidth={true} margin="normal">
              <TextField variant="outlined" label="Account Name" value={this.state.account} onChange={e => this.handleChange("account", e.target.value)} />
            </FormControl>
            <FormControl component="div" fullWidth={true} margin="normal">
              <TextField variant="outlined" label="Password" type="password" value={this.state.password} onChange={e => this.handleChange("password", e.target.value)} />
            </FormControl>
            <FormControl component="div" fullWidth={true} margin="normal">
              <InputLabel id="instance-select">Instance</InputLabel>
              <Select labelId="instance-select" value={this.state.instance} onChange={e => this.handleChange("instance", e.target.value)}>
                {instanceList.map(instance => (
                  <MenuItem value={instance} key={instance}>{instance}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl component="div" fullWidth={true} margin="normal">
              <TextField variant="outlined" label="Character Name" value={this.state.character} onChange={e => this.handleChange("characterName", e.target.value)} />
            </FormControl>
            <FormControl component="div" fullWidth={true} margin="normal">
              <Button variant="contained" color={this.allFieldsValid() ? "primary" : "secondary"} type="button" onClick={this.sendConnect}>Connect</Button>
            </FormControl>
          </form>
        </Box>
      </div>
    )
  }
}