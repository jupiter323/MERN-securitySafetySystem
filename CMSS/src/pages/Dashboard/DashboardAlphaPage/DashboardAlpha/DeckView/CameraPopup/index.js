import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { getSecurityEventsByCameraId } from 'ducks/CameraEventView'
import { getAllDeviceAttributes } from 'ducks/logHistory'
import rootReducer from 'ducks/redux'
import './style.scss'
import { message } from 'antd'
import cookie from 'react-cookie'

let socketUrl = rootReducer.socketUrl

const mapStateToProps = (state, props) => ({})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
})

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class CameraPopup extends React.Component {
  ws = new WebSocket(socketUrl)
  socketOpened = false

  componentDidMount() {
    this.openSocket()
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
          case 'CameraLiftActionSingle': {
            if (result_array.length === 6) {
              let result = result_array[5].slice(0, -1)

              if (result === 'OK') {
                let cameraName = this.props.info.accessInfo ? this.props.info.accessInfo.DeviceName : "This device";
                let command = result_array[4].slice(0, -1)
                message.info(
                  cameraName + ' is ' + command === 'Raise'
                    ? 'raised'
                    : 'lowered' + ' successfully.',
                )
                getAllDeviceAttributes(this.props.dispatch)
              } else {
                message.error('Can not raise/lower this camera..')
              }
            } else if (result_array.length === 7) {
              let result = result_array[5].slice(0, -1)

              if (result === 'OK') {
                let cameraName = this.props.info.accessInfo ? this.props.info.accessInfo.DeviceName : "This device";
                let command = result_array[4].slice(0, -1)
                message.info(
                  cameraName + ' is ' + command === 'Raise'
                    ? 'raised'
                    : 'lowered' + ' successfully.',
                )
                getAllDeviceAttributes(this.props.dispatch)
              } else {
                message.error('Can not raise/lower this camera..')
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

  onRaiseLowerClick = () => {
    if (!this.socketOpened) {
      this.openSocket()
      message.error('Socket is disconnected! ...Please try again.')
    } else {
      let { info } = this.props
      let accessInfo = info.accessInfo
      if (accessInfo.EquipmentSubTypeID === 2 && accessInfo.AuxDeviceID > 1) {
        let message = '<CameraLiftActionSingle><'
        let user = cookie.load('UserName')
        let isRaise = accessInfo.status.includes('Raise')
        console.log('isRaise', isRaise)
        message += user + '><' + accessInfo.DeviceName + '><'
        message += isRaise ? 'Lower>' : 'Raise>'
        console.log('message: ', message)
        this.ws.send(message)
      } else {
        message.warning('This camera is not lift camera.')
      }
    }
  }

  onCamDisplayClick = cameraID => {
    let { addCameraView } = this.props
    addCameraView(cameraID)
  }

  onEventHistoryClick = () => {
    let { dispatch, info } = this.props
    dispatch({
      type: 'SET_CAMERA_EVENT_VIEW_DISPLAY',
      display: true,
      cameraInfo: info,
    });
 
    // setTimeout(() => {
    //   getSecurityEventsByCameraId(info.accessInfo.DeviceID, dispatch)
    // }, 10000);

  }

  render() {
    let { info, displayInfo } = this.props
    let { display, left, top } = displayInfo
    let cameraId = ''
    let visible = false
    if (info.accessInfo) {
      console.log('CameraInfo: ', info)
      cameraId = info.accessInfo.camera ? info.accessInfo.camera.Id : ''
      visible = info.accessInfo.cameraViewInfo ? info.accessInfo.cameraViewInfo.visible : true
    }
    let displayCam = visible ? 'none' : 'block'
    return (
      <div
        className={'CameraPopup'}
        style={{
          display: display,
          left: left + 15 < 100 ? left + 1 + '%' : left - 16 + '%',
          top: top + 60 < 100 ? top + 5 + '%' : top - 60 + '%',
        }}
      >
        <div className={'caption'}>CAMERA OPTIONS</div>
        <div className={'option'} onClick={this.onRaiseLowerClick}>
          RAISE/LOWER
        </div>
        <div
          className={'option'}
          style={{ display: displayCam }}
          onClick={this.onCamDisplayClick.bind(this, cameraId)}
        >
          DISPLAY CAM
        </div>
        <div className={'option'} onClick={this.onEventHistoryClick}>
          EVENT HISTORY
        </div>
      </div>
    )
  }
}

export default CameraPopup
