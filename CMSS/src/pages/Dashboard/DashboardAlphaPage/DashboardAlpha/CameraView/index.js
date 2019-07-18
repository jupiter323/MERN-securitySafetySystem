/* eslint-disable no-undef */
import React from 'react'

import { connect } from 'react-redux'

import { liveStream } from '../CameraControl/liveStream'
import './style.scss'

const mapStateToProps = (state, props) => ({
  urls: state.urls,
  devicesInfo: state.devicesInfo,
  accessInfo: state.accessInfo,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
})
let timeout = null

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class CameraView extends React.Component {
  state = {
    src: '',
    urls: this.props.urls,
    roundButton: 'resources/images/icons/round-button.png',
    bgZoom: 'resources/images/icons/bg-zoom.png',
    border: 'blue',
    display: 'none',
    cameraType: 'camera-fixed',
  }

  cameraController = null

  componentDidMount() {
    let { camera, dispatch } = this.props
    this.cameraController = new liveStream(camera, dispatch)
  }

  componentWillUnmount() {
    //this.cameraController.closeVideoConnection()
  }

  controlDisplay = e => {
    let { isPlayBack } = this.props
    if (!isPlayBack) {
      this.setState({ display: 'flex' })
    } else {
      this.setState({ display: 'flex' })
    }
    if (timeout === null) {
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    } else {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    }
  }

  ptzUp = e => {
    this.cameraController.ptzMove('Up')
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    }
  }

  ptzLeft = e => {
    this.cameraController.ptzMove('Left')
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    }
  }

  ptzDown = e => {
    this.cameraController.ptzMove('Down')
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    }
  }

  ptzRight = e => {
    this.cameraController.ptzMove('Right')
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    }
  }

  ptzZoomIn = e => {
    this.cameraController.ptzZoom('ZoomIn')
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    }
  }

  ptzZoomOut = e => {
    this.cameraController.ptzZoom('ZoomOut')
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    }
  }

  playbackStop = e => {
    this.props.dispatch({ type: 'SET_PLAYBACK', playBack: {} })
    this.cameraController.switchToLive()
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    }
  }

  playbackPlay = e => {
    console.log('Play start')
    this.cameraController.playForwardTrigger()
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    }
  }

  playbackPause = e => {
    console.log('Playback Pause')
    this.cameraController.playbackChangeSpeed(0)
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    }
  }

  playbackBack = e => {
    this.cameraController.gotoStart()
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    }
  }

  playbackRew = e => {
    console.log('Playback Reward')
    this.cameraController.fastBackward()
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    }
  }

  playbackFwd = e => {
    console.log('Playback Forward')
    this.cameraController.fastForward()
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    }
  }

  playbackNext = e => {
    console.log('Next')
    this.cameraController.gotoEnd()
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    }
  }

  playbackRecord = e => {
    let { camera, isPlayBack } = this.props
    if (isPlayBack) {
      this.switchToRecord()
    }
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setState({ display: 'none' })
      }, 120000)
    }
  }

  switchToRecord = () => {
    if (this.cameraController) {
      //this.cameraController.videoPushConnection();
    }
  }

  switchToPlayback = playBackTime => {
    if (this.cameraController) {
      this.cameraController.switchToPlayback(playBackTime)
    }
  }

  switchToLive = () => {
    if (this.cameraController) {
      this.cameraController.switchToLive()
    }
  }

  render() {
    let { camera, dispatch, devicesInfo, accessInfo } = this.props
    let devicesArray = devicesInfo.devicesArray
    let currentCamera = devicesInfo.currentCamera
    let cameraType = ''
    devicesArray.map(device => {
      if (device.EquipmentTypeID === 2 && device.DeviceName === camera.Name) {
        let cameraTypeId = device.EquipmentSubTypeID
        switch (cameraTypeId) {
          case 2:
            cameraType = 'camera-fixed'
            break
          case 3:
            cameraType = 'camera-ptz'
            break
          case 4:
            cameraType = 'camera-360'
            break
        }
      }
    })

    let { urls, isPlayBack, receivedAlramFrom } = this.props
    let isPlaying = urls.isPlaying
    if (isPlayBack) {
      this.switchToPlayback(urls.playBackTime)
      if (typeof urls.videoInfo !== 'undefined' && urls.videoInfo.hasOwnProperty('signal')) {
        let downloadSignal = urls.videoInfo.signal
        if (downloadSignal === 'download') {
          if (!urls.videoInfo.hasOwnProperty('isDownloading')) {
            this.cameraController.exportAvi()
            dispatch({
              type: 'SET_PLAYBACK_VIDEO_DOWNLOAD',
              videoInfo: {
                signal: 'download',
                isDownloading: true,
              },
            })
          }
        }
      }
    } else {
      this.switchToLive()
    }
    let { border, display } = this.state
    let src = urls.imageURLs[camera.Id] || ''  
    if (receivedAlramFrom)
      border = 'red'
    else if (currentCamera.hasOwnProperty('DeviceName') && currentCamera.DeviceName === camera.Name) {
      border = 'green'
    } else if (isPlayBack) {
      border = 'green'
    }
    let cornerImage = ''
    let className = 'h7 camera-name'
    if (border === 'red') {
      cornerImage = 'resources/images/background/red-corner.png'
      className += ' red'
    } else if (border === 'blue') {
      cornerImage = 'resources/images/background/blue-corner.png'
      className += ' blue'
    } else if (border === 'green') {
      cornerImage = 'resources/images/background/green-corner.png'
      className += ' green'
    }
    return (
      <div className="CameraController">
        <img src={src} className="CameraView" id={camera.Id} alt="cameraImage" />
        <div className={'cameraLoadingArea'} id={'cameraLoadingArea' + camera.Id}>
          <span className={'rotationArea'}>
            <img className={'rotationIcon'} src={'resources/images/icons/graphic-spinner.svg'} />
          </span>
        </div>
        <img src={cornerImage} className="cornerImage" alt="corner" />
        <div className={className}>{camera.Name}</div>
        <button className={cameraType} onClick={this.controlDisplay} />
        <CameraControls
          isPlayBack={isPlayBack}
          isPtz={cameraType === 'camera-ptz'}
          display={display}
          bgZoom={this.state.bgZoom}
          ptzUp={this.ptzUp}
          ptzLeft={this.ptzLeft}
          ptzDown={this.ptzDown}
          ptzRight={this.ptzRight}
          ptzZoomIn={this.ptzZoomIn}
          ptzZoomOut={this.ptzZoomOut}
          playbackStop={this.playbackStop}
          playbackPlay={this.playbackPlay}
          playbackPause={this.playbackPause}
          playbackBack={this.playbackBack}
          playbackRew={this.playbackRew}
          playbackFwd={this.playbackFwd}
          playbackNext={this.playbackNext}
          playbackRecord={this.playbackRecord}
          roundButton={this.state.roundButton}
        />
      </div>
    )
  }
}

function CameraControls(props) {
  let { isPtz, isPlayBack, display, bgZoom, roundButton } = props
  if (!isPlayBack) {
    if (isPtz) {
      return (
        <div>
          <div className={'zoomContainer'}>
            <div className="zoom-button" style={{ display: display }}>
              <img
                src={bgZoom}
                style={{
                  height: '100%',
                }}
                alt="zoom"
              />
              <button className="zoom-out" onClick={props.ptzZoomOut} />
              <button className="zoom-in" onClick={props.ptzZoomIn} />
            </div>
          </div>
          <div className="roundButton" style={{ display: display }}>
            <img
              src={roundButton}
              style={{
                height: '100%',
              }}
              alt="round"
            />
            <button className="top-button" onClick={props.ptzUp} />
            <button className="left-button" onClick={props.ptzLeft} />
            <button className="bottom-button" onClick={props.ptzDown} />
            <button className="right-button" onClick={props.ptzRight} />
          </div>
        </div>
      )
    } else {
      return <div />
    }
  } else {
    let backButton = 'resources/images/icons/backButton.png'
    let fwdButton = 'resources/images/icons/fwdButton.png'
    let nextButton = 'resources/images/icons/nextButton.png'
    let pauseButton = 'resources/images/icons/pauseButton.png'
    let playButton = 'resources/images/icons/playButton.png'
    let recordButton = 'resources/images/icons/recordButton.png'
    let rewButton = 'resources/images/icons/rewButton.png'
    let stopButton = 'resources/images/icons/stopButton.png'

    return (
      <div className="playBackControls" style={{ display: display }}>
        <button className="controlButton" onClick={props.playbackStop}>
          <img className="controlButtonImage" src={stopButton} alt="stop" />
        </button>
        <button className="controlButton" onClick={props.playbackPlay}>
          <img className="controlButtonImage" src={playButton} alt="play" />
        </button>
        <button className="controlButton" onClick={props.playbackPause}>
          <img className="controlButtonImage" src={pauseButton} alt="pause" />
        </button>
        <button className="controlButton" onClick={props.playbackBack}>
          <img className="controlButtonImage" src={backButton} alt="back" />
        </button>
        <button className="controlButton" onClick={props.playbackRew}>
          <img className="controlButtonImage" src={rewButton} alt="reward" />
        </button>
        <button className="controlButton" onClick={props.playbackFwd}>
          <img className="controlButtonImage" src={fwdButton} alt="forward" />
        </button>
        <button className="controlButton" onClick={props.playbackNext}>
          <img className="controlButtonImage" src={nextButton} alt="next" />
        </button>
        <button className="controlButton" onClick={props.playbackRecord}>
          <img className="controlButtonImage" src={recordButton} alt="record" />
        </button>
      </div>
    )
  }
}

export default CameraView
