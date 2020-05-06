import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Loading from './Loading'

const modalStyle = {
  backgroundColor: 'white',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 100,
  border: '1px solid rgba(0, 0, 0, 0.5)',
  borderRadius: 2,
  padding: 10
}

const instanceLookup = {
  DR: 'DragonRealms',
  DRD: 'DragonRealms Development',
  DRF: 'DragonRealms The Fallen',
  DRT: 'DragonRealms Prime Test',
  DRX: 'DragonRealms Platinum',
  GS3: 'GemStone IV',
  GS4D: 'GemStone IV Development',
  GSF: 'GemStone IV Shattered',
  GST: 'GemStone IV Prime Test',
  GSX: 'GemStone IV Platinum',
  'DragonRealms': 'DR',
  'DragonRealms Development': 'DRD',
  'DragonRealms The Fallen': 'DRF',
  'DragonRealms Prime Test': 'DRT',
  'DragonRealms Platinum': 'DRX',
  'GemStone IV': 'GS3',
  'GemStone IV Development': 'GS4D',
  'GemStone IV Shattered': 'GSF',
  'GemStone IV Prime Test': 'GST',
  'GemStone IV Platinum': 'GSX'
}

export default class AccountModal extends Component {
  state = {
    account: "",
    instance: "",
    characterName: "",
    showAddAccount: false
  }

  handleChange = (field, value) => {
    const newState = { [field]: value }
    this.setState(newState)
  }

  canConnect = () => {
    const { account, instance, characterName } = this.state
    if (!account) return false
    if (!instance) return false
    if (!characterName) return false
    return true
  }

  // todo: button for login help? https://www.play.net/dr/login/login_help.asp
  loadAccountSignupPage = () => {
    this.props.sendCommand('#url https://www.play.net/dr/signup/')
  }

  sendConnect = () => {
    const { account, instance, characterName } = this.state
    console.log(`#connect ${account} ${instance} ${characterName}`)
    if (!this.canConnect()) return
    this.props.sendCommand(`#connect ${account} ${instance} ${characterName}`)
    this.props.closeConnectModal()
  }

  render() {
    return (
      <>
        <div style={modalStyle}>
          <Box>
            <Button style={{ position: "fixed", right: 20 }} type="button" onClick={this.props.closeConnectModal}>x</Button>
            <form style={{ paddingTop: "2rem" }} autoComplete="off">
              <h3>Connect to Game</h3>
              <div style={{ marginTop: "2rem" }}>
                <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                  <Button variant="contained" onClick={() => this.handleChange('showAddAccount', true)}>Add Existing Account</Button>
                  <Button variant="contained" onClick={this.loadAccountSignupPage}>Create New Account</Button>
                </ButtonGroup>
              </div>
              {this.props.accounts && (
                <div style={{ marginTop: "2rem" }}>
                  <InputLabel id='account-dropdown'>Select Account</InputLabel>
                  <Select
                    style={{width: '100%'}}
                    variant="outlined"
                    labelId='account-dropdown'
                    value={this.state.account}
                    onChange={e => this.handleChange('account', e.target.value)}
                  >
                    <MenuItem value="" />
                    {this.props.accounts.map(account => (
                      <MenuItem value={account} key={account}>{account}</MenuItem>
                    ))}
                  </Select>
                </div>
              )}
              {this.state.account && (
                <div style={{ marginTop: "2rem" }}>
                  <InputLabel id='instance-dropdown'>Select Game</InputLabel>
                  <Select
                    style={{width: '100%'}}
                    variant="outlined"
                    labelId='instance-dropdown'
                    onChange={e => this.handleChange('instance', e.target.value)}
                    value={this.state.instance}
                  >
                    {Object.keys(this.props.characters[this.state.account]).map(instance => (
                      <MenuItem key={instance} value={instance}>{instanceLookup[instance]}</MenuItem>
                    ))}
                  </Select>
                </div>
              )}
              {this.state.instance && (
                <>
                  <div style={{ marginTop: "2rem" }}>
                    <div>Account Type: {this.props.characters[this.state.account][this.state.instance].accountType.replace(/_/g, ' ')}</div>
                    <div>Slots Used: {this.props.characters[this.state.account][this.state.instance].slotsUsed}</div>
                    <div>Slots Remaining: {this.props.characters[this.state.account][this.state.instance].slotsTotal - this.props.characters[this.state.account][this.state.instance].slotsUsed}</div>
                    <div>Slots Total: {this.props.characters[this.state.account][this.state.instance].slotsTotal}</div>
                  </div>
                  <div style={{ marginTop: "2rem" }}>
                    <InputLabel id='character-dropdown'>Select Character</InputLabel>
                    <Select
                      style={{width: '100%'}}
                      variant="outlined"
                      labelId='character-dropdown'
                      onChange={e => this.handleChange('characterName', e.target.value)}
                      value={this.state.characterName}
                    >
                      {this.props.characters[this.state.account][this.state.instance].characterList.map(({name}) => (
                        <MenuItem key={name} value={name}>{name}</MenuItem>
                      ))}
                      {/* <MenuItem value='-NewChar-'>Create New Character</MenuItem> */}
                    </Select>
                    
                  </div>
                </>
              )}
              {this.canConnect() && (
                <div style={{ marginTop: "2rem" }}>
                  <Button variant="contained" color='primary' style={{ width: '100%' }} onClick={this.sendConnect}>
                    Connect
                  </Button>
                </div>
              )}
            </form>
          </Box>
        </div>
        {this.state.showAddAccount && (
          <AddExistingAccount
            closeModal={() => this.setState({showAddAccount: false})}
            sendCommand={this.props.sendCommand}
            loadAccounts={this.props.loadAccounts}
            loadCharacters={this.props.loadCharacters}
          />
        )}
      </>
    )
  }
}



// todo: make this a modal on top of the other modal...
class AddExistingAccount extends Component {
  state = {
    account: '',
    password: '',
    loading: false
  }

  handleChange = (field, value) => {
    const newState = {}
    newState[field] = field === "account" ? value.trim().toUpperCase() : value.trim()
    this.setState(newState)
  }

  shouldRenderAddBtn = () => {
    // Passwords must be at least seven alphanumeric characters long
    // todo: determine min account name length
    const { account, password } = this.state
    if (account.length < 5) return false
    if (password.length < 7) return false
    return true
  }

  validateAccount = () => {
    const { account, password } = this.state
    this.props.sendCommand(`#validateAccount ${account} ${password}`)
    this.setState({ loading: true })
    setTimeout(() => {
      this.props.loadAccounts()
      this.props.loadCharacters()
      this.props.closeModal()
    }, 5000)
    // todo: need a way to determine success
    // I need a global context to process incoming text and send outgoing commands
    // this context should also store global vars ($righthand, $gametime, etc)
  }

  render() {
    const higherModalStyle = {...modalStyle, zIndex: 101}

    return (
      <>
        {this.state.loading && <Loading />}
        <div style={higherModalStyle}>
          <Box>
            <Button style={{ position: "fixed", right: 20 }} type="button" onClick={this.props.closeModal}>x</Button>
            <form style={{ paddingTop: "2rem", textAlign: 'center' }} autoComplete="off">
              <h3>Add Existing Simutronics Account Credentials</h3>
              <FormControl component="div" fullWidth={true} margin="normal">
                <TextField variant="outlined" label="Account Name" value={this.state.account} onChange={e => this.handleChange("account", e.target.value)} />
              </FormControl>
              <FormControl component="div" fullWidth={true} margin="normal">
                <TextField variant="outlined" label="Password" type="password" value={this.state.password} onChange={e => this.handleChange("password", e.target.value)} />
              </FormControl>
              {this.shouldRenderAddBtn() && (
                <div>
                  <Button onClick={this.validateAccount}>
                    Save Account Credentials
                  </Button>
                </div>
              )}
            </form>
          </Box>
        </div>
      </>
    )
  }
}
