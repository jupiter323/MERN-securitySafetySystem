import React from 'react'
import { connect } from 'react-redux'

import DatePicker from 'react-datepicker/es'

import 'rc-time-picker/assets/index.css'
import TimePicker from 'rc-time-picker'
import moment from 'moment'

import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

import { Input } from 'antd'

import './style.scss'

const format = 'h:mm'
const now = moment()

const mapStateToProps = (state, props) => ({
  urls: state.urls,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
})

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class PlaybackView extends React.Component {
  constructor(props) {
    super(props)
    let t_day = new Date()
    t_day.setSeconds(0)
    let minute = Math.round(t_day.getMinutes() / 10) * 10
    t_day.setMinutes(minute)
    now._d = t_day
    this.state = {
      border: 'blue',
      day: t_day,
      horizontal: 10,
      startTime: t_day.getTime() - 600000,
      endTime: t_day.getTime(),
      sliderMaxValue: 0,
      sliderStart: t_day.getTime(),
      saveFileName: '',
    }
  }
  componentDidMount() {}

  handleDayChange = day => {
    let { startTime, endTime } = this.state

    this.setState({ day: day })
    let tempDayStart = new Date(startTime)
    tempDayStart.setDate(day.getDate())
    tempDayStart.setMonth(day.getMonth())
    tempDayStart.setFullYear(day.getFullYear())
    this.setState({ startTime: tempDayStart.getTime() })

    let tempDayEnd = new Date(endTime)
    tempDayEnd.setDate(day.getDate())
    tempDayEnd.setMonth(day.getMonth())
    tempDayEnd.setFullYear(day.getFullYear())
    this.setState({ endTime: tempDayEnd.getTime() })

    this.setState({ sliderMaxValue: Math.abs(tempDayEnd.getTime() - tempDayStart.getTime()) })
    this.setState({
      sliderStart:
        tempDayEnd.getTime() > tempDayStart.getTime()
          ? tempDayStart.getTime()
          : tempDayEnd.getTime(),
    })
  }

  handleChangeHorizontal = (value, e) => {
    console.log('event: ', e)
    this.setState({
      horizontal: value,
    })
  }

  onStartTimeChange = time => {
    let { startTime, endTime } = this.state

    let tempDay = new Date(startTime)
    tempDay.setHours(time._d.getHours())
    tempDay.setMinutes(time._d.getMinutes())
    tempDay.setSeconds(time._d.getSeconds())
    this.setState({ startTime: tempDay.getTime() })

    this.setState({ sliderMaxValue: Math.abs(endTime - tempDay.getTime()) })
    this.setState({ sliderStart: endTime > tempDay.getTime() ? tempDay.getTime() : endTime })
  }

  onEndTimeChange = time => {
    let { startTime, endTime } = this.state
    let tempDay = new Date(endTime)
    tempDay.setHours(time._d.getHours())
    tempDay.setMinutes(time._d.getMinutes())
    tempDay.setSeconds(time._d.getSeconds())
    this.setState({ endTime: tempDay.getTime() })
    this.setState({ sliderMaxValue: Math.abs(tempDay.getTime() - startTime) })
    this.setState({ sliderStart: tempDay.getTime() > startTime ? startTime : tempDay.getTime() })
  }

  onSearchClick = e => {
    let { startTime, endTime } = this.state
    this.props.dispatch({
      type: 'SET_PLAYBACK_TIME',
      playBackTime: {
        startTime: startTime,
        endTime: endTime,
      },
    })
    this.props.dispatch({
      type: 'SET_PLAYBACK_VIDEO_DOWNLOAD',
      videoInfo: {},
    })
  }

  onSaveFileChange = event => {
    this.setState({
      saveFileName: event.target.value,
    })
  }

  onInputFieldClick = event => {
    event.preventDefault()
    console.log('onInputClick: ', this.textInput)
    this.textInput.focus()
  }
  onSaveClick = event => {
    event.preventDefault()
    let { dispatch, urls } = this.props
    let videoInfo = urls.videoInfo
    console.log('videoInfo', videoInfo)
    if (!videoInfo.hasOwnProperty('signal')) {
      console.log('Hello robin')
      dispatch({
        type: 'SET_PLAYBACK_VIDEO_DOWNLOAD',
        videoInfo: {
          signal: 'download',
        },
      })
    }
  }

  render() {
    let {
      border,
      horizontal,
      startTime,
      endTime,
      sliderMaxValue,
      sliderStart,
      saveFileName,
    } = this.state
    let cornerImage = ''
    let searchImage = ''
    let saveImage = ''
    if (border === 'blue') {
      cornerImage = 'resources/images/background/blue-corner.png'
      searchImage = 'resources/images/icons/SVG/Search Icon.svg'
      saveImage = 'resources/images/icons/SVG/Save File Icon.svg'
    }
    let { playbackCamera, urls } = this.props
    let cameraName = '',
      cameraId = ''
    horizontal = urls.playBackTimeSeek
    let enabled = urls.videoInfo.enabled
    let videoUrl = ''
    if (enabled) {
      videoUrl = urls.videoInfo.url
    }
    if (typeof playbackCamera !== 'undefined' && playbackCamera.hasOwnProperty('Name')) {
      cameraName = playbackCamera.Name
      cameraId = playbackCamera.Id
      cornerImage = 'resources/images/background/green-corner.png'
    } else {
    }

    let { day } = this.state
    let startTemp = new Date(sliderStart)
    let endTemp = new Date(sliderStart + sliderMaxValue)
    const horizontalLabels = {
      0:
        startTemp.getHours() +
        ':' +
        ('0' + startTemp.getMinutes()).slice(-2) +
        ':' +
        ('0' + startTemp.getSeconds()).slice(-2),
      [sliderMaxValue]:
        endTemp.getHours() +
        ':' +
        ('0' + endTemp.getMinutes()).slice(-2) +
        ':' +
        ('0' + endTemp.getSeconds()).slice(-2),
    }
    const formatkg = value => new Date(this.state.sliderStart + value).toLocaleTimeString()
    const formatPc = p => p + '%'
    return (
      <div>
        <div className="PlaybackController">
          <div
            className="h7 cameraName blue"
            style={{ display: cameraName !== '' ? 'block' : 'none' }}
          >
            {cameraName}
          </div>
          <DatePicker inline selected={day} onChange={this.handleDayChange} />
          <div className="timeRange">
            <div
              className="row"
              style={{
                width: '100%',
                margin: '0%',
              }}
            >
              <div className="col-xl-5" style={{ padding: '0px' }}>
                <div className="timeLabel">START:</div>
                <TimePicker
                  showSecond={false}
                  defaultValue={now}
                  className="xxx"
                  onChange={this.onStartTimeChange}
                  format={format}
                  inputReadOnly
                />
              </div>
              <div className="col-xl-5" style={{ padding: '0px' }}>
                <div className="timeLabel">END:</div>
                <TimePicker
                  showSecond={false}
                  defaultValue={now}
                  className="xxx"
                  onChange={this.onEndTimeChange}
                  format={format}
                  inputReadOnly
                />
              </div>
              <div className="col-xl-2">
                <button className="searchButton" onClick={this.onSearchClick}>
                  <img src={searchImage} className="searchImage" alt="search" />
                </button>
              </div>
            </div>

            {/* <div className="slider orientation-reversed">
              <div className="slider-horizontal">
                <Slider
                  className="playSlider"
                  min={0}
                  max={sliderMaxValue}
                  value={horizontal}
                  labels={horizontalLabels}
                  format={formatkg}
                  //handleLabel={horizontal}
                  onChange={this.handleChangeHorizontal}
                />
              </div>
            </div> */}
            <hr
              style={{
                width: '100%',
                color: 'rgb(0,0,255)',
              }}
            />
          </div>

          <div className="saveArea">
            {enabled ? (
              <button className="saveButton">
                <a href={videoUrl} download={saveFileName}>
                  <img src={saveImage} className="saveImage" alt="save" />
                </a>
              </button>
            ) : (
              <button className="saveButton" onClick={this.onSaveClick}>
                <img src={saveImage} className="saveImage" alt="save" />
              </button>
            )}
            <Input
              className="saveFile"
              ref={input => {
                this.textInput = input
              }}
              onMouseDown={e => {
                e.preventDefault()
              }}
              onClick={this.onInputFieldClick}
              onChange={this.onSaveFileChange}
            />
            <div className="saveLabel">FILE</div>
          </div>
        </div>
        <img src={cornerImage} className="cornerImage" alt="corner" />
      </div>
    )
  }
}

export default PlaybackView
