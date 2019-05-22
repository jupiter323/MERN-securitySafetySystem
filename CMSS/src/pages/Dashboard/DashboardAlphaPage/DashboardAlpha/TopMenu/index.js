import React from 'react'
import { connect } from 'react-redux'
import { getSecurityEventsByDeviceID } from 'ducks/logHistory'
import { triggerManualEvent } from 'ducks/Milestone'
import SecuritySetting from './SecuritySetting'
import LoginView from './Login'
import rootReducer from 'ducks/redux'
import cookie from 'react-cookie'
import './style.scss'
import { message } from 'antd'
import { Card, Col, Row } from 'antd'
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import _ from "lodash"

let solarisLogo = 'resources/images/logo/4.png'
let customViewImage = 'resources/images/icons/SVG/View Layout Icon.svg'
let deckViewImage = 'resources/images/icons/SVG/Deck Select Icon.svg'
let volumeImage = 'resources/images/icons/SVG/Sound On Icon.svg'
let cameraViewImage = 'resources/images/icons/SVG/Cam Generic Icon.svg'
let camLiftImage = 'resources/images/icons/SVG/Cam Lift Icon.svg'
let playbackImage = 'resources/images/icons/SVG/Playback Icon.svg'
let accessControlImage = 'resources/images/icons/SVG/Access Control Icon.svg'
let deckSensorImage = 'resources/images/icons/SVG/Deck Sensor Icon.svg'
let droneImage = 'resources/images/icons/SVG/Drone Icon.svg'
let eventLogImage = 'resources/images/icons/SVG/Event Log Icon.svg'
let numKeyPadImage = 'resources/images/icons/SVG/Keypad Icon.svg'
let palladiumLogoImage = 'resources/images/icons/SVG/Palladium Logo.svg'
let num0Image = 'resources/images/icons/SVG/0 Button.svg'
let num1Image = 'resources/images/icons/SVG/1 Button.svg'
let num2Image = 'resources/images/icons/SVG/2 Button.svg'
let num3Image = 'resources/images/icons/SVG/3 Button.svg'
let num4Image = 'resources/images/icons/SVG/4 Button.svg'
let num5Image = 'resources/images/icons/SVG/5 Button.svg'
let num6Image = 'resources/images/icons/SVG/6 Button.svg'
let num7Image = 'resources/images/icons/SVG/7 Button.svg'
let num8Image = 'resources/images/icons/SVG/8 Button.svg'
let num9Image = 'resources/images/icons/SVG/9 Button.svg'
let backImage = 'resources/images/icons/SVG/Back Button.svg'
let enterImage = 'resources/images/icons/SVG/Enter Button.svg'
let ownersCitadelSLockedImage = 'resources/images/icons/SVG/Owners Citadel Button Selected-Locked.svg'
let generalCitadelSLockedImage = 'resources/images/icons/SVG/General Citadel Button Selected-Locked.svg'
let normalOpSLocked = 'resources/images/icons/SVG/Normal Op Button Selected-Locked.svg'
let acknowledgeSLocked = 'resources/images/icons/SVG/Acknowledge Button Selected-Locked.svg'
let emergencySLocked = 'resources/images/icons/SVG/Emergency DACS Button Selected-Locked.svg'
const getAllDeckZonSensor = () => gql`
  query get {
    DeckZones {       
      DeckZoneName 
      DeckNumber      
      DeckLocations {      
        SecurityDevices {       
          Equipments(EquipmentTypeName:"Deck Sensor") {
            EquipmentTypeName
          }
        }
      }
    }
  }
`;

const mapStateToProps = (state, props) => ({
  urls: state.urls,
  decks: state.decksInfo,
  devices: state.devicesInfo,
  accessInfo: state.accessInfo,
  deckLocations: state.deckLocationsInfo,
  widgetInfo: state.widgetInfo,
  deckZonesInfo: state.deckZonesInfo,
  eventInfo: state.eventInfo,
  systemInfo: state.systemInfo,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
})

let socketUrl = rootReducer.socketUrl

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class TopMenu extends React.Component {
  state = {
    playbackExpand: -1,
    cameraExpand: -1,
    accessDeckExpand: -1,
    deckSensorExpand: -1,
    camLiftExpand: -1,
    camLiftSubmenuExpand: -1,
    loginViewDisplay: 'none',
    securitySettingDisplay: 'none',
    userName: '',
    password: '',
    keyboardInputValue: '',
    wsversion: ""
  }

  ws = new WebSocket(socketUrl)
  socketOpened = false

  componentDidMount() {
    this.ws.onopen = () => {
      console.log('opened')
      this.socketOpened = true
    }

    this.ws.onmessage = evt => {
      var received_msg = evt.data
      let result_array = received_msg.split('<')
      if (result_array.length > 1) {
        let command_type = result_array[1].slice(0, -1)
        switch (command_type) {
          case 'UserCheckPermission': {
            if (result_array.length === 7) {
              let result = result_array[5].slice(0, -1)
              if (result === 'OK') {
                this.setState({
                  securitySettingDisplay: 'block',
                })
              } else {
                message.error('User has no permission for setting system security level.')
              }
            }
            document.getElementById('root').style.cursor = 'default'
            break
          }
          case 'UserChangeSecurityLevel': {
            if (result_array.length === 6) {
              let result = result_array[5].slice(0, -1)
              if (result === 'OK') {
                let data = '<GetSystemInfo>'
                this.ws.send(data)
              } else {
                message.error("Can not change the security level.");
              }
            }
            break
          }
          case 'GetSystemInfo': {
            console.log('GetSystemInfo: ', received_msg)
            if (result_array.length === 8) {
              let securityLevel = result_array[5].slice(0, -1)
              let result = result_array[2].slice(0, -1)
              if (result === 'OK') {
                let { dispatch } = this.props
                dispatch({
                  type: 'SET_System_Security_Level',
                  systemSecurityLevel: securityLevel,
                })
                cookie.save('SecurityLevelId', result_array[3].slice(0, -1))
                cookie.save('SecurityLevelImage', result_array[5].slice(0, -1))
              }
              document.getElementById('root').style.cursor = 'default'
            }
            break
          }
          case 'SystemInfo': {
            console.log('SystemInfo: ', received_msg)
            if (result_array.length === 8) {
              let securityLevel = result_array[5].slice(0, -1)
              let result = result_array[2].slice(0, -1)
              if (result === 'OK') {
                let { dispatch } = this.props
                dispatch({
                  type: 'SET_System_Security_Level',
                  systemSecurityLevel: securityLevel,
                })
                cookie.save('SecurityLevelId', result_array[3].slice(0, -1))
                cookie.save('SecurityLevelImage', result_array[5].slice(0, -1))
                this.setState({ wsversion: result_array[4].slice(0, -1) })
              } else {

              }
            }
            break
          }
          case 'CameraLiftActionAll': {
            console.log('CameraLiftActionAll: ', received_msg)
            let result = result_array[4].slice(0, -1)
            if (result === 'OK') {
              let type = result_array[3].slice(0, -1)
              if (type === 'Raise') {
                message.success('All cameras are raised successfully.')
              } else {
                message.success('All cameras are lowered successfully.')
              }
            } else {
              let type = result_array[3].slice(0, -1)
              if (type === 'Raise') {
                message.error('Raise all cameras action is failed.')
              } else {
                message.error('Lower all cameras action is failed.')
              }
            }
            break
          }
          case 'CameraLiftActionSingle': {
            console.log('CameraLiftActionSingle: ', received_msg)
            let result = result_array[5].slice(0, -1)
            if (result === 'OK') {
              let type = result_array[4].slice(0, -1)
              if (type === 'Raise') {
                message.success('Camera is raised successfully.')
              } else {
                message.success('Camera is lowered successfully.')
              }
            } else {
              let type = result_array[4].slice(0, -1)
              if (type === 'Raise') {
                let messageTxt = result_array[6].slice(0, -1)
                message.error(messageTxt + '\tInsufficient permission to operate the camera rise.')
              } else {
                let messageTxt = result_array[6].slice(0, -1)
                message.error(messageTxt + '\tInsufficient permission to operate the camera lower.')
              }
            }
            break
          }
          case 'DeckSensorAllEnable': {
            console.log('DeckSensorAllEnable: ', received_msg)
            let result = result_array[4].slice(0, -1)
            if (result === 'OK') {
              let type = result_array[3].slice(0, -1)
              if (type === 'Enable') {
                message.success('All deck sensors are enabled successfully.')
              } else {
                message.success('All deck sensors are disabled successfully.')
              }
            } else {
              let type = result_array[3].slice(0, -1)
              if (type === 'Enable') {
                message.error('Enable all deck sensors is failed.')
              } else {
                message.error('Disable all deck sensors is failed.')
              }
            }
            break
          }
          case 'DeckSensorZoneEnable': {
            console.log('DeckSensorZoneEnable: ', received_msg)
            let result = result_array[6].slice(0, -1)
            if (result === 'OK') {
              let type = result_array[5].slice(0, -1)
              if (type === 'Enable') {
                message.success('All deck sensors in this deck zone are enabled successfully.')
              } else {
                message.success('All deck sensors in this deck zone are disabled successfully.')
              }
            } else {
              let type = result_array[5].slice(0, -1)
              if (type === 'Enable') {
                message.error('Enable all deck sensors in this deck zone is failed.')
              } else {
                message.error('Disable all deck sensors in this deck zone is failed.')
              }
            }
            break
          }
        }
      }
    }

    this.ws.onclose = () => {
      // websocket is closed.
      console.log('Connection is closed...')
      this.socketOpened = false
      document.getElementById('root').style.cursor = 'default'
    }
  }

  openSocket = () => {
    this.ws.onopen = () => {
      console.log('opened')
      this.socketOpened = true
    }

    this.ws.onmessage = evt => {
      console.log('receive mag', evt.data)
      var received_msg = evt.data
      let result_array = received_msg.split('<')
      if (result_array.length > 1) {
        let command_type = result_array[1].slice(0, -1)
        switch (command_type) {
          case 'UserCheckPermission': {
            if (result_array.length === 7) {
              let result = result_array[5].slice(0, -1)
              if (result === 'OK') {
                this.setState({
                  securitySettingDisplay: 'block',
                })
              } else {
                message.error('User has no permission for setting system security level.')
              }
            }
            document.getElementById('root').style.cursor = 'default'
            break
          }
          case 'UserChangeSecurityLevel': {
            if (result_array.length === 6) {
              let result = result_array[5].slice(0, -1)
              if (result === 'OK') {
                let data = '<GetSystemInfo>'
                this.ws.send(data)
              } else {
                message.error("Can not change the security level.")
              }
            }
            break
          }
          case 'GetSystemInfo': {
            console.log('GetSystemInfo: ', received_msg)
            if (result_array.length === 8) {
              let securityLevel = result_array[5].slice(0, -1)
              let result = result_array[2].slice(0, -1)
              if (result === 'OK') {
                let { dispatch } = this.props
                dispatch({
                  type: 'SET_System_Security_Level',
                  systemSecurityLevel: securityLevel,
                })
                cookie.save('SecurityLevelId', result_array[3].slice(0, -1))
                cookie.save('SecurityLevelImage', result_array[5].slice(0, -1))
              }
              document.getElementById('root').style.cursor = 'default'
            }
            break
          }
          case 'SystemInfo': {
            console.log('SystemInfo: ', received_msg)
            if (result_array.length === 8) {
              let securityLevel = result_array[5].slice(0, -1)
              let result = result_array[2].slice(0, -1)
              if (result === 'OK') {
                let { dispatch } = this.props
                dispatch({
                  type: 'SET_System_Security_Level',
                  systemSecurityLevel: securityLevel,
                })
                cookie.save('SecurityLevelId', result_array[3].slice(0, -1))
                cookie.save('SecurityLevelImage', result_array[5].slice(0, -1))
                this.setState({ wsversion: result_array[4].slice(0, -1) })
              }
            }
            break
          }
        }
      }
    }

    this.ws.onclose = () => {
      // websocket is closed.
      console.log('Connection is closed...')
      this.socketOpened = false
      document.getElementById('root').style.cursor = 'default'
    }

    setTimeout(() => {
      if (!this.socketOpened) {
        //message.error('Cannot connect to Safety and Security System.');
      }
    }, 2000)
  }

  selectPlayback = (camera, cameras, e) => {
    let deviceName = camera.DeviceName
    let playbackCamera = cameras.find(camera => {
      return camera.Name === deviceName
    })
    let { dispatch, widgetInfo, addPlaybackView } = this.props
    if (typeof playbackCamera !== 'undefined') {
      dispatch({
        type: 'SET_PLAYBACK',
        playbackCamera: playbackCamera,
      })
      dispatch({
        type: 'SET_CUR_CAMERA',
        currentCamera: {},
      })
    }
    let visible = widgetInfo.playbackView.visible
    if (!visible) {
      addPlaybackView()
    }
    dispatch({
      type: 'SET_PLAYBACK_VIDEO_DOWNLOAD',
      videoInfo: {},
    })
  }

  selectDeck = (deck, shown) => {
    console.log('currentDeck: ', deck)
    let { dispatch, addDeckView } = this.props
    if (typeof deck !== 'undefined') {
      dispatch({
        type: 'SET_CUR_DECK',
        currentDeck: deck,
      })
    }
    if (!shown) {
      addDeckView()
    }
    let accessInfo = {
      enabled: false,
      location: {
        room: '',
        deck: '',
      },
      clearance: 0,
      cameraId: '',
    }
    dispatch({
      type: 'CLEAR_ACCESS',
      accessInfo: accessInfo,
    })
  }

  onCameraSelect = (cameraId, visible) => {
    let { dispatch, addCameraView } = this.props
    if (!visible) {
      this.props.addCameraView(cameraId)
    }
  }

  onPlaybackExpand = index => {
    let { playbackExpand } = this.state
    if (index === playbackExpand) {
      this.setState({
        playbackExpand: -1,
      })
    } else {
      this.setState({
        playbackExpand: index,
      })
    }
  }

  onAccessDeckExpand = index => {
    let { accessDeckExpand } = this.state
    if (index === accessDeckExpand) {
      this.setState({
        accessDeckExpand: -1,
      })
    } else {
      this.setState({
        accessDeckExpand: index,
      })
    }
  }

  onCameraExpand = index => {
    let { cameraExpand } = this.state
    if (index === cameraExpand) {
      this.setState({
        cameraExpand: -1,
      })
    } else {
      this.setState({
        cameraExpand: index,
      })
    }
  }

  onAccessMenuClick = accessInfo => {
    let { dispatch } = this.props
    console.log('accessInfo: ', accessInfo)
    if (accessInfo.EquipmentTypeID !== 3) return
    let eventLogs = this.props.eventInfo.eventLogs

    // getSecurityEventsByDeviceID(accessInfo, eventLogs, dispatch)
    document.getElementById('root').style.cursor = 'wait'
    triggerManualEvent()
    setTimeout(() => {
      dispatch({
        type: 'CLEAR_DATA',
        accessInfo: accessInfo,
      })
      getSecurityEventsByDeviceID(accessInfo, dispatch)
    }, 100)
  }

  onDeckSensorDropDownClick = index => {
    let { deckSensorExpand } = this.state
    let tempIndex = -1
    if (deckSensorExpand !== index) {
      tempIndex = index
    }
    this.setState({
      deckSensorExpand: tempIndex,
    })
  }

  onCamLiftDropDownClick = index => {
    let { camLiftExpand } = this.state
    let tempIndex = -1
    if (camLiftExpand !== index) {
      tempIndex = index
    }
    this.setState({
      camLiftExpand: tempIndex,
    })
  }

  onCamLiftSubmenuDropDownClick = index => {
    let { camLiftSubmenuExpand } = this.state
    let tempIndex = -1
    if (camLiftSubmenuExpand !== index) {
      tempIndex = index
    }
    this.setState({
      camLiftSubmenuExpand: tempIndex,
    })
  }

  onCameraLiftItemClick = (deviceInfo, type) => {
    console.log('CameraLiftClick: ', deviceInfo, type)
    if (type === 2 || type === 3) {
      if (deviceInfo.AuxDeviceID === 1) {
        message.warning('This camera is not lift camera.')
        return
      }
    }
    let messageInfo = ''
    let user = cookie.load('UserName')
    switch (type) {
      case 0: {
        messageInfo += '<CameraLiftActionAll><' + user + '><Raise>'
        break
      }
      case 1: {
        messageInfo += '<CameraLiftActionAll><' + user + '><Lower>'
        break
      }
      case 2: {
        messageInfo +=
          '<CameraLiftActionSingle><' + user + '><' + deviceInfo.DeviceName + '><Raise>'
        break
      }
      case 3: {
        messageInfo +=
          '<CameraLiftActionSingle><' + user + '><' + deviceInfo.DeviceName + '><Lower>'
        break
      }
    }
    if (!this.socketOpened) {
      this.openSocket()
      message.error('Socket is disconnected! ...Please try again.')
    } else {
      this.ws.send(messageInfo)
    }
  }

  onDeckSensorItemClick = async (zoneInfo, type) => {
    let messageInfo = ''
    let user = cookie.load('UserName')
    switch (type) {
      case 0: {
        messageInfo = '<DeckSensorAllEnable><' + user + '><Enable>'
        break
      }
      case 1: {
        messageInfo = '<DeckSensorAllEnable><' + user + '><Disable>'
        break
      }
      case 2: {

        let curDeck = await this.props.decks.decksArray.find(deck => {
          return deck.DeckNumber === zoneInfo.DeckNumber
        })
        console.log(zoneInfo, type, this.props.decks)
        messageInfo +=
          '<DeckSensorZoneEnable><' +
          user +
          '><' +
          curDeck.DeckName +
          '><' +
          zoneInfo.DeckZoneName +
          '><Enable>'
        break
      }
      case 3: {
        let curDeck = this.props.decks.decksArray.find(deck => {
          return deck.DeckNumber === zoneInfo.DeckNumber
        })
        messageInfo +=
          '<DeckSensorZoneEnable><' +
          user +
          '><' +
          curDeck.DeckName +
          '><' +
          zoneInfo.DeckZoneName +
          '><Disable>'
        break
      }
    }
    console.log('message: ', messageInfo)
    if (!this.socketOpened) {
      this.openSocket()
      message.error('Socket is disconnected! ...Please try again.')
    } else {
      this.ws.send(messageInfo)
    }
  }

  onEventItemClick = type => {
    console.log(type)
    let { addEventView, removeView } = this.props
    if (type === 0) {
      addEventView()
    }
    if (type === 1) {
      removeView('eventView')
    }
  }

  openLoginView = () => {
    if (!this.socketOpened) {
      this.openSocket()
      message.error('Socket is disconnected! ...Please try again.')
    } else {
      this.setState({
        loginViewDisplay: 'block',
      })
    }
  }

  openSecuritySettingView = (userName, password) => {
    this.setState({
      userName: userName,
      password: password,
    })
  }

  closeSecuritySetting = () => {
    this.setState({
      securitySettingDisplay: 'none',
    })
  }

  closeLoginView = () => {
    this.setState({
      loginViewDisplay: 'none',
    })
  }

  handleDroneView = () => {
    let { addSensorView } = this.props
    addSensorView()
  }

  handleKeyboardInput = async (key) => {
    let { keyboardInputValue } = this.state
    if (key === "-1") return this.setState({ keyboardInputValue: keyboardInputValue.substring(0, keyboardInputValue.length - 1) })
    if (key === "-2") return message.info("completed number input as " + this.state.keyboardInputValue);
    this.setState({ keyboardInputValue: keyboardInputValue + key });
  }

  render() {
    let { decks, devices, deckLocations, urls, accessInfo, deckZonesInfo, systemInfo } = this.props
    let deckZones
    if (deckZonesInfo.deckZones) {
      deckZones = deckZonesInfo.deckZones
    }
    let { securitySettingDisplay, loginViewDisplay, userName, password } = this.state
    let securityLevel =
      systemInfo.systemSecurityLevel !== 'none'
        ? systemInfo.systemSecurityLevel
        : cookie.load('SecurityLevelImage')
    let securityLevelImage = 'resources/images/icons/SVG/' + securityLevel
    return (
      <div className="topMenu">
        <ul className="nav" style={{ height: '4rem' }}>
          <li className="mySolaris">
            <img className="logoImage" src={solarisLogo} alt="CustomView" />
          </li>
          <li>
            <img className="menuItemImage" src={customViewImage} alt="CustomView" />
            <DropDownViewOption type="VIEW OPTIONS" />
          </li>
          <li>
            <img className="menuItemImage" src={deckViewImage} alt="DeckView" />
            <DropDownDecks
              type="DECK SELECT"
              decks={decks.decksArray}
              currentDeck={decks.currentDeck}
              onSelect={this.selectDeck}
              widgetInfo={this.props.widgetInfo.deckView}
            />
          </li>
          <li>
            <img className="menuItemImage" src={volumeImage} alt="Volume" />
            <DropDownSound type="SOUND" />
          </li>
          <li>
            <img className="menuItemImage" src={cameraViewImage} alt="CameraView" />
            <DropDownCameras
              type={'CAMERAS'}
              decks={decks.decksArray}
              cameras={urls.cameras}
              currentCamera={devices.currentCamera}
              devices={devices.devicesArray}
              deckLocations={deckLocations.deckLocationArray}
              onCameraSelect={this.onCameraSelect}
              onExpand={this.onCameraExpand}
              expandedIndex={this.state.cameraExpand}
              widgetInfo={this.props.widgetInfo.cameraViews}
            />
          </li>
          <li>
            <img className="menuItemImage" src={camLiftImage} alt="CameraLift" />
            <DropDownCamLift
              type={'CAM LIFTS'}
              dropDownItemClick={this.onCamLiftDropDownClick}
              submenuDropDownItemClick={this.onCamLiftSubmenuDropDownClick}
              expandedIndex={this.state.camLiftExpand}
              submenuExpandedIndex={this.state.camLiftSubmenuExpand}
              itemClick={this.onCameraLiftItemClick}
              devices={devices}
            />
          </li>
          <li>
            <img className="menuItemImage" src={playbackImage} alt="Playback" />
            <DropDownPlayback
              type={'CAMERAS'}
              decks={decks.decksArray}
              cameras={urls.cameras}
              currentPlayback={urls.playbackCamera}
              devices={devices.devicesArray}
              deckLocations={deckLocations.deckLocationArray}
              onSelect={this.selectPlayback}
              onExpand={this.onPlaybackExpand}
              expandedIndex={this.state.playbackExpand}
            />
          </li>
          <li>
            <img className="menuItemImage" src={accessControlImage} alt="AccessControl" />
            <DropDownAccessPoint
              type={'ACCESS CONTROL'}
              decks={decks.decksArray}
              devices={devices.devicesArray}
              deckLocations={deckLocations.deckLocationArray}
              accessInfo={accessInfo}
              onAccessMenuClick={this.onAccessMenuClick}
              onAccessDeckExpand={this.onAccessDeckExpand}
              expandedIndex={this.state.accessDeckExpand}
            />
          </li>
          <li>
            <img className="menuItemImage" src={deckSensorImage} alt="DeckSensor" />
            <DropDownDeckSensor
              type={'DECK SENSORS'}
              deckZones={deckZones}
              dropDownItemClick={this.onDeckSensorDropDownClick}
              expandedIndex={this.state.deckSensorExpand}
              itemClick={this.onDeckSensorItemClick}
            />
          </li>
          <li>
            <img className="menuItemImage" src={droneImage} alt="DroneView" />
            <DropDownDroneView type={'DRONE VIEW'} onClick={this.handleDroneView} />
          </li>
          <li>
            <img className="menuItemImage" src={eventLogImage} alt="EventLog" />
            <DropDownEvent type={'EVENT LOG'} onClick={this.onEventItemClick} />
          </li>
          <li>
            <img className="menuItemImage" src={numKeyPadImage} alt="NumKeyPad" />
            <DropDownNumKeyPad type={'KEY PAD'} handleKeyboardInput={this.handleKeyboardInput} keyboardInputValue={this.state.keyboardInputValue} />
          </li>
          <li className={'palladiumLogo'}>
            <img
              className="menuItemImage bigItemImage"
              src={palladiumLogoImage}
              alt="PalladiumLogo"
            />
            <DropDownLogo type={'PALLADIUM TECHNOLOGIES'} wsversion = {this.state.wsversion}/>
          </li>
          <li className={'securityLavel'} onClick={this.openLoginView}>
            <img
              className="menuItemImage bigItemImage"
              src={securityLevelImage}
              alt="SecurityLevel"
            />
          </li>
        </ul>
        <LoginView
          display={loginViewDisplay}
          webSocket={this.ws}
          onClose={this.closeLoginView}
          openSecuritySettingView={this.openSecuritySettingView}
        />
        <SecuritySetting
          display={securitySettingDisplay}
          webSocket={this.ws}
          userName={userName}
          password={password}
          onClose={this.closeSecuritySetting}
        />
      </div>
    )
  }
}

function DropDown(props) {
  let { type } = props
  return (
    <ul className="dropdown">
      <li className="title">
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      <li>
        <div className="dropdownlink">
          <i className="fa fa-road" aria-hidden="true" /> History
          <i className="fa fa-chevron-down" aria-hidden="true" />
        </div>
        <ul className="submenuItems">
          <li>
            <a href="#">History book 1</a>
          </li>
          <li>
            <a href="#">History book 2</a>
          </li>
          <li>
            <a href="#">History book 3</a>
          </li>
        </ul>
      </li>
      <li>
        <div className="dropdownlink">
          <i className="fa fa-paper-plane" aria-hidden="true" /> Fiction
          <i className="fa fa-chevron-down" aria-hidden="true" />
        </div>
        <ul className="submenuItems">
          <li>
            <a href="#">Fiction book 1</a>
          </li>
          <li>
            <a href="#">Fiction book 2</a>
          </li>
          <li>
            <a href="#">Fiction book 3</a>
          </li>
        </ul>
      </li>
      <li>
        <div className="dropdownlink">
          <i className="fa fa-quote-left" aria-hidden="true" /> Fantasy
          <i className="fa fa-chevron-down" aria-hidden="true" />
        </div>
        <ul className="submenuItems">
          <li>
            <a href="#">Fantasy book 1</a>
          </li>
          <li>
            <a href="#">Fantasy book 2</a>
          </li>
          <li>
            <a href="#">Fantasy book 3</a>
          </li>
        </ul>
      </li>
      <li>
        <div className="dropdownlink">
          <i className="fa fa-motorcycle" aria-hidden="true" /> Action
          <i className="fa fa-chevron-down" aria-hidden="true" />
        </div>
        <ul className="submenuItems">
          <li>
            <a href="#">Action book 1</a>
          </li>
          <li>
            <a href="#">Action book 2</a>
          </li>
          <li>
            <a href="#">Action book 3</a>
          </li>
        </ul>
      </li>
    </ul>
  )
}
function DropDownNumKeyPad(props) {
  let { handleKeyboardInput, keyboardInputValue } = props
  return (
    <ul className="dropdown numkeypad p-1">
      <div className="row w-100 m-0 top-row-num">
        <div className="col p-0 h-100">
          <div className="row m-0 top-row-digit">
            <div className="sub-content w-100 m-2">
              <label className="title">
                {
                  keyboardInputValue.split("").map((e, i) => i > 5 ? "" : "*")
                }
              </label>
            </div>
          </div>
          <div className="row m-0 top-row-message h-75">
            <div className="sub-content w-100 m-2">
            </div>
          </div>
        </div>
        <div className="col p-0 h-100">
          <div className="row m-0 w-100 p-0">
            <div className="col-4 m-0 p-0 h-100" onClick={() => { handleKeyboardInput("1") }}>
              <img
                className="m-0"
                src={num1Image}
                alt="SecurityLevel"
              />
            </div>
            <div className="col-4 m-0 p-0 h-100" onClick={() => { handleKeyboardInput("2") }}>
              <img
                className="m-0"
                src={num2Image}
                alt="SecurityLevel"
              />
            </div>
            <div className="col-4 m-0 p-0 h-100" onClick={() => { handleKeyboardInput("3") }}>
              <img
                className="m-0"
                src={num3Image}
                alt="SecurityLevel"
              />
            </div>
          </div>
          <div className="row m-0 w-100 p-0">
            <div className="col-4 m-0 p-0 h-100" onClick={() => { handleKeyboardInput("4") }}>
              <img
                className="m-0"
                src={num4Image}
                alt="SecurityLevel"
              />
            </div>
            <div className="col-4 m-0 p-0 h-100" onClick={() => { handleKeyboardInput("5") }}>
              <img
                className="m-0"
                src={num5Image}
                alt="SecurityLevel"
              />
            </div>
            <div className="col-4 m-0 p-0 h-100" onClick={() => { handleKeyboardInput("6") }}>
              <img
                className="m-0"
                src={num6Image}
                alt="SecurityLevel"
              />
            </div>
          </div>
          <div className="row m-0 w-100 p-0">
            <div className="col-4 m-0 p-0 h-100" onClick={() => { handleKeyboardInput("7") }}>
              <img
                className="m-0"
                src={num7Image}
                alt="SecurityLevel"
              />
            </div>
            <div className="col-4 m-0 p-0 h-100" onClick={() => { handleKeyboardInput("8") }}>
              <img
                className="m-0"
                src={num8Image}
                alt="SecurityLevel"
              />
            </div>
            <div className="col-4 m-0 p-0 h-100" onClick={() => { handleKeyboardInput("9") }}>
              <img
                className="m-0"
                src={num9Image}
                alt="SecurityLevel"
              />
            </div>
          </div>
          <div className="row m-0 w-100 p-0">
            <div className="col-4 m-0 p-0 h-100" onClick={() => { handleKeyboardInput("0") }}>
              <img
                className="m-0"
                src={num0Image}
                alt="SecurityLevel"
              />
            </div>
            <div className="col-4 m-0 p-0 h-100" onClick={() => { handleKeyboardInput("-1") }}>
              <img
                className="m-0"
                src={backImage}
                alt="SecurityLevel"
              />
            </div>
            <div className="col-4 m-0 p-0 h-100" onClick={() => { handleKeyboardInput("-2") }}>
              <img
                className="m-0"
                src={enterImage}
                alt="SecurityLevel"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row w-100 m-0">
        <div className="col p-0 m-0 h-100">
          <img
            className="m-0"
            src={ownersCitadelSLockedImage}
            alt="SecurityLevel"
          />
        </div>
        <div className="col p-0 m-0 h-100">
          <img
            className="m-0"
            src={generalCitadelSLockedImage}
            alt="SecurityLevel"
          />
        </div>
        <div className="col p-0 m-0 h-100">
          <img
            className="m-0"
            src={normalOpSLocked}
            alt="SecurityLevel"
          />
        </div>
        <div className="col p-0 m-0 h-100">
          <img
            className="m-0"
            src={emergencySLocked}
            alt="SecurityLevel"
          />
        </div>
        <div className="col p-0 m-0 h-100">
          <img
            className="m-0"
            src={acknowledgeSLocked}
            alt="SecurityLevel"
          />
        </div>
      </div>
    </ul>
  )
}
function DropDownLogo(props) {
  let { type, wsversion } = props
  return (
    <ul className="dropdown palladium-logo">
      <li className="title">
        <div style={{ textDecoration: 'underline' }}>{type}</div>
      </li>
      <li className={"content"}>
        <div className="dropdownlink">
          {`${process.env.REACT_APP_NAME} ${process.env.REACT_APP_VERSION}`}
        </div>
      </li>
      <li className={"content"}>
        <div className="dropdownlink">
          {`web socket version : ${wsversion}`}
        </div>
      </li>
      <li className={"content"}>
        <div className="dropdownlink">
          3900 SW 30th Avenue
        </div>
      </li>
      <li className={"content"}>
        <div className="dropdownlink">
          Fort Lauderdale, FL 33312
        </div>
      </li>
      <li className={"content"}>
        <div className="dropdownlink">
          USA
        </div>
      </li>
      <li className={"content"}>
        <div className="dropdownlink">
          support@palladiumtechs.com
        </div>
      </li>

      <li className={"content"}>
        <div className="dropdownlink">
          +1-954-653-0630
        </div>
      </li>
      <li className={"content"}>
        <div className="dropdownlink">
          www.palladiumtechs.com
        </div>
      </li>
    </ul>
  )
}

function DropDownViewOption(props) {
  let { type } = props
  return (
    <ul className="dropdown">
      <li className={'title'}>
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      <li>
        <div className="dropdownlink">LOAD CUSTOM</div>
      </li>
      <li>
        <div className="dropdownlink">SAVE CUSTOM</div>
      </li>
    </ul>
  )
}

function DropDownDecks(props) {
  let { type, decks, currentDeck, onSelect, widgetInfo } = props
  let visible = widgetInfo.visible
  return (
    <ul className="dropdown">
      <li className={'title'}>
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      {decks.map(deck => {
        if (deck.DeckName === 'No Deck') return <div />
        let className = 'dropdownlink'
        let shown = false
        if (currentDeck === deck && visible) {
          shown = true
          className += ' shown'
        }
        return (
          <li onClick={onSelect.bind(this, deck, shown)}>
            <div className={className}>
              {deck.DeckName}
              {shown ? <i className={'fa fa-eye'} /> : <i className={'fa fa-eye-slash'} />}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function DropDownSound(props) {
  let { type } = props
  return (
    <ul className="dropdown">
      <li className={'title'}>
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      <li>
        <div className="dropdownlink">ON</div>
      </li>
      <li>
        <div className="dropdownlink">OFF</div>
      </li>
    </ul>
  )
}

function DropDownCameras(props) {
  let {
    type,
    decks,
    cameras,
    devices,
    deckLocations,
    onCameraSelect,
    onExpand,
    expandedIndex,
    widgetInfo,
  } = props
  return (
    <ul className="dropdown">
      <li className={'title'}>
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      {decks.map(deck => {
        if (deck.DeckName === 'No Deck') return <div />
        let deckNumber = deck.DeckNumber
        let deckCameras = []
        let currentLocations = deckLocations.filter(location => {
          return location.DeckNumber === deckNumber
        })
        currentLocations.map(location => {
          let locationId = location.LocationID
          let curDevice = devices.find(device => {
            return device.LocationID === locationId && device.EquipmentTypeID === 2
          })
          if (curDevice !== undefined) {
            deckCameras.push(curDevice)
          }
        })
        let cameraPtzImage = 'resources/images/icons/camera-ptz.png'
        let cameraFixedImage = 'resources/images/icons/camera-fixed.png'
        let camera360Image = 'resources/images/icons/camera-360.png'
        let index = decks.indexOf(deck)
        return (
          <li>
            <div className="dropdownlink" onClick={onExpand.bind(this, index)}>
              <i
                className={
                  index !== expandedIndex
                    ? 'fa fa-caret-right parentItem'
                    : 'fa fa-caret-down parentItem'
                }
                aria-hidden="true"
              />
              {deck.DeckName}
            </div>
            <ul
              className="submenuItems"
              style={expandedIndex === index ? { display: 'block' } : { display: 'none' }}
            >
              {deckCameras.map(camera => {
                let className = 'listItem'
                let curCamera = cameras.find(__camera => {
                  return __camera.Name === camera.DeviceName
                })
                if (typeof curCamera === 'undefined') return
                let curWidget = widgetInfo.find(widget => {
                  return widget.id === curCamera.Id
                })
                let visible = false
                let cameraId = ''
                if (typeof curWidget !== 'undefined' && curWidget.hasOwnProperty('visible')) {
                  visible = curWidget.visible
                  cameraId = curWidget.id
                }
                if (visible) {
                  className += ' shown'
                }
                return (
                  <li onClick={onCameraSelect.bind(this, cameraId, visible)}>
                    <div className={className}>
                      <img
                        className="liItemImage"
                        src={
                          camera.EquipmentSubTypeID === 2
                            ? cameraFixedImage
                            : camera.EquipmentSubTypeID === 3
                              ? cameraPtzImage
                              : camera360Image
                        }
                        alt="CameraImage"
                      />
                      <p className={'cameraName'}>{camera.DeviceName}</p>
                      {visible ? (
                        <i className="fa fa-eye" aria-hidden="true" />
                      ) : (
                          <i className="fa fa-eye-slash" aria-hidden="true" />
                        )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

function DropDownPlayback(props) {
  let {
    type,
    decks,
    cameras,
    devices,
    deckLocations,
    onSelect,
    currentPlayback,
    onExpand,
    expandedIndex,
  } = props
  return (
    <ul className="dropdown">
      <li className={'title'}>
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      {decks.map(deck => {
        if (deck.DeckName === 'No Deck') return <div />
        let deckNumber = deck.DeckNumber
        let deckCameras = []
        let currentLocations = deckLocations.filter(location => {
          return location.DeckNumber === deckNumber
        })
        currentLocations.map(location => {
          let locationId = location.LocationID
          let curDevice = devices.find(device => {
            return device.LocationID === locationId && device.EquipmentTypeID === 2
          })
          if (curDevice !== undefined) {
            deckCameras.push(curDevice)
          }
        })
        let cameraPtzImage = 'resources/images/icons/camera-ptz.png'
        let cameraFixedImage = 'resources/images/icons/camera-fixed.png'
        let camera360Image = 'resources/images/icons/camera-360.png'
        let index = decks.indexOf(deck)
        return (
          <li>
            <div className="dropdownlink" onClick={onExpand.bind(this, index)}>
              <i
                className={
                  expandedIndex !== index
                    ? 'fa fa-caret-right parentItem'
                    : 'fa fa-caret-down parentItem'
                }
                aria-hidden="true"
              />
              {deck.DeckName}
            </div>
            <ul
              className="submenuItems"
              style={expandedIndex === index ? { display: 'block' } : { display: 'none' }}
            >
              {deckCameras.map(camera => {
                let className = 'listItem'
                if (
                  typeof currentPlayback !== 'undefined' &&
                  currentPlayback.hasOwnProperty('Name') &&
                  camera.DeviceName === currentPlayback.Name
                )
                  className += ' selected'
                return (
                  <li onClick={onSelect.bind(this, camera, cameras)}>
                    <div className={className}>
                      <img
                        className="liItemImage"
                        src={
                          camera.EquipmentSubTypeID === 2
                            ? cameraFixedImage
                            : camera.EquipmentSubTypeID === 3
                              ? cameraPtzImage
                              : camera360Image
                        }
                        alt="CameraImage"
                      />
                      <p className={'cameraName'}>{camera.DeviceName}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

function DropDownCamLift(props) {
  let {
    type,
    dropDownItemClick,
    submenuDropDownItemClick,
    expandedIndex,
    submenuExpandedIndex,
    itemClick,
    devices,
  } = props

  let cameraArray = devices.devicesArray.filter(device => {
    return device.EquipmentTypeID === 2
  })
  return (
    <ul className="dropdown">
      <li className="title">
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      <li>
        <div className="dropdownlink" onClick={dropDownItemClick.bind(this, 0)}>
          <i
            className={
              expandedIndex !== 0 ? 'fa fa-caret-right parentItem' : 'fa fa-caret-down parentItem'
            }
            aria-hidden="true"
          />
          ALL
        </div>
        <ul
          className="submenuItems"
          style={expandedIndex === 0 ? { display: 'block' } : { display: 'none' }}
        >
          <li onClick={itemClick.bind(this, 'all', 0)}>UP</li>
          <li onClick={itemClick.bind(this, 'all', 1)}>DOWN</li>
        </ul>
      </li>
      <li>
        <div className="dropdownlink" onClick={dropDownItemClick.bind(this, 1)}>
          <i
            className={
              expandedIndex !== 1 ? 'fa fa-caret-right parentItem' : 'fa fa-caret-down parentItem'
            }
            aria-hidden="true"
          />
          BY CAMERA
        </div>
        <ul
          className="submenuItems"
          style={expandedIndex === 1 ? { display: 'block' } : { display: 'none' }}
        >
          {cameraArray.filter(e => e.AuxDeviceID !== 1).map(camera => {
            let index = cameraArray.indexOf(camera)
            return (
              <li>
                <div className="dropdownlink" onClick={submenuDropDownItemClick.bind(this, index)}>
                  <i
                    className={
                      submenuExpandedIndex !== index ? 'fa fa-caret-right' : 'fa fa-caret-down'
                    }
                    aria-hidden="true"
                  />
                  {camera.DeviceName}
                </div>
                <ul
                  className="submenuItems"
                  style={
                    submenuExpandedIndex === index ? { display: 'block' } : { display: 'none' }
                  }
                >
                  <li onClick={itemClick.bind(this, camera, 2)}>UP</li>
                  <li onClick={itemClick.bind(this, camera, 3)}>DOWN</li>
                </ul>
              </li>
            )
          })}
        </ul>
      </li>
    </ul>
  )
}

function DropDownAccessPoint(props) {
  let {
    type,
    decks,
    devices,
    deckLocations,
    accessInfo,
    onAccessMenuClick,
    onAccessDeckExpand,
    expandedIndex,
  } = props
  return (
    <ul className="dropdown">
      <li className={'title'}>
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      {decks.map(deck => {
        if (deck.DeckName === 'No Deck') return <div />
        let deckNumber = deck.DeckNumber
        let index = decks.indexOf(deck)
        let curDevices = []
        let curLocations = deckLocations.filter(deckLocation => {
          return deckLocation.DeckNumber === deck.DeckNumber
        })
        curLocations.map(location => {
          let device = devices.find(device => {
            return device.LocationID === location.LocationID
          })
          if (typeof device !== 'undefined') {
            let deviceInfo = Object.assign({}, device, location)
            curDevices.push(deviceInfo)
          }
        })
        curDevices = curDevices.filter(device => {
          return device.EquipmentTypeID === 3
        })
        return (
          <li>
            <div className="dropdownlink" onClick={onAccessDeckExpand.bind(this, index)}>
              <i
                className={
                  expandedIndex !== index
                    ? 'fa fa-caret-right parentItem'
                    : 'fa fa-caret-down parentItem'
                }
                aria-hidden="true"
              />
              {deck.DeckName}
            </div>
            <ul
              className="submenuItems"
              style={expandedIndex === index ? { display: 'block' } : { display: 'none' }}
            >
              {curDevices.map(device => {
                let accessInfo = device
                accessInfo.enabled = true
                accessInfo.DeckName = deck.DeckName
                let className = 'listItem'
                return (
                  <li onClick={onAccessMenuClick.bind(this, accessInfo)}>
                    <div className={className}>
                      <p
                        className={'cameraName'}
                        style={{ textAlign: 'left', paddingLeft: '20px' }}
                      >
                        {'- ' + device.LocationName}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}
var includeDecksensor = (DeckLocations) => {
  const equipmenttypename = "Deck Sensor"
  for (let e of DeckLocations)
    for (let ee of e['SecurityDevices'])
      for (let eee of ee['Equipments'])
        if (eee['EquipmentTypeName'] === equipmenttypename) return true
}
function DropDownDeckSensor(props) {
  let { type, dropDownItemClick, expandedIndex, itemClick } = props
  return (
    <ul className="dropdown">
      <li className="title">
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      <li>
        <div className="dropdownlink" onClick={dropDownItemClick.bind(this, 0)}>
          <i
            className={
              expandedIndex !== 0 ? 'fa fa-caret-right parentItem' : 'fa fa-caret-down parentItem'
            }
            aria-hidden="true"
          />
          <span className={'subTitle'}>{'ALL'}</span>
        </div>
        <ul
          className="submenuItems"
          style={expandedIndex === 0 ? { display: 'block' } : { display: 'none' }}
        >
          <li onClick={itemClick.bind(this, 'all', 0)}>
            <div className={'listItem functionItem'}>{'ON'}</div>
          </li>
          <li onClick={itemClick.bind(this, 'all', 1)}>
            <div className={'listItem functionItem'}>{'OFF'}</div>
          </li>
        </ul>
      </li>
      <li>
        <div className="dropdownlink" onClick={dropDownItemClick.bind(this, 1)}>
          <i
            className={
              expandedIndex !== 1 ? 'fa fa-caret-right parentItem' : 'fa fa-caret-down parentItem'
            }
            aria-hidden="true"
          />
          <span className={'subTitle'}>{'BY ZONE'}</span>
        </div>
        <Query query={getAllDeckZonSensor()}>
          {({ loading, data }) => !loading && (
            <ul
              className="submenuItems"
              style={expandedIndex === 1 ? { display: 'block' } : { display: 'none' }}
            >
              {_.filter(data.DeckZones, e => includeDecksensor(e.DeckLocations)).map(deckZone => {
                if (deckZone.DeckZoneName === 'No Zone') return <div />
                return (
                  <li>
                    <div className={'subCaption'}>{deckZone.DeckZoneName}</div>
                    <div
                      className={'listItem functionItem'}
                      onClick={itemClick.bind(this, deckZone, 2)}
                    >
                      {'ON'}
                    </div>
                    <div
                      className={'listItem functionItem'}
                      onClick={itemClick.bind(this, deckZone, 3)}
                    >
                      {'OFF'}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Query>
      </li>
    </ul>
  )
}

function DropDownEvent(props) {
  let { type, onClick } = props
  return (
    <ul className="dropdown">
      <li className="title">
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      <li>
        <div className="dropdownlink" onClick={onClick.bind(this, 0)}>
          OPEN
        </div>
      </li>
      <li>
        <div className="dropdownlink" onClick={onClick.bind(this, 1)}>
          CLOSE
        </div>
      </li>
    </ul>
  )
}

function DropDownDroneView(props) {
  let { type, onClick } = props
  return (
    <ul className="dropdown">
      <li className="title">
        <label style={{ textDecoration: 'underline' }}>{type}</label>
      </li>
      <li>
        <div className="dropdownlink" onClick={onClick}>
          OPEN
        </div>
      </li>
    </ul>
  )
}

export default TopMenu
