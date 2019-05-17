import React from 'react'
import { connect } from 'react-redux'
import { getSecurityEventsByCameraId, updateCameraEventLogs } from 'ducks/CameraEventView'
import Resizable from 're-resizable'
import $ from 'jquery'
import './style.scss'

let scroll_flag = true
let update_flag = true
let eventRow_count = 50
let init_flag = false

const mapStateToProps = (state, props) => ({
  urls: state.urls,
  devicesInfo: state.devicesInfo,
  deckLocationsInfo: state.deckLocationsInfo,
  cameraEventViewInfo: state.cameraEventViewInfo,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
})

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class CameraEventView extends React.Component {
  constructor(props) {
    super(props)
    init_flag = false
    this.state = {
      border: 'blue',
      sortType: 'datetime',
      sortOrder: 0,
      limit_count: 50,
    }
  }

  componentDidMount() {
    //this.initTable();
    $('#CameraEventLogView').draggable({})

  }

  componentDidUpdate() {
    if (!init_flag) {
      this.initTable()
      $('#CameraEventLogView')
        .width(600)
        .height(400)
    }
  }

  onClose = () => {
    let { dispatch } = this.props
    this.setState({
      sortType: 'datetime',
      sortOrder: 0,
      limit_count: 50,
    })
    $('#cameraEventTableContainer')
      .find('.tableArea')
      .empty()
    $('#cameraEventTableContainer').scrollTop(0)
    $('#cameraEventTableContainer')
      .find('.tableArea')
      .css('display', 'none')
    if ($('#CameraEventLogView')) {
      $('#CameraEventLogView').css({ top: 100, left: 200 })
    }
    dispatch({
      type: 'CLOSE_CAMERA_EVENT_VIEW_DISPLAY',
    })
    init_flag = false
    clearTimeout()
  }

  updateLatest = (latestLogs, latest_time) => {
    let { sortType, sortOrder } = this.state
    let { cameraEventViewInfo } = this.props
    if (!$('#cameraEventTableContainer')[0]) return
    let scrollTop = $('#cameraEventTableContainer')[0].scrollTop
    if (sortType === 'datetime' && sortOrder === 0 && scrollTop === 0 && latestLogs.length > 0) {
      latest_time = latestLogs[0].DateTime
      let eventLogs = []
      let eventArray = latestLogs
      let length = eventArray.length
      for (let i = length - 1; i > -1; i--) {
        let event = eventArray[i]
        let row = {}
        row.eventType = event.EventMsg.toUpperCase()
        row.datetime = new Date(event.DateTime)
          .toLocaleString('en-GB', { timeZone: 'UTC' })
          .replace(',', '')
        row.device = event.SecurityDevice.DeviceName.toUpperCase()
        row.location = event.SecurityDevice.DeckLocation.LocationName.toUpperCase()
        let type_temp = row.eventType.split(' ')
        if (type_temp.includes('GRANTED') || type_temp.includes('GRANTED.')) {
          row.type = 'green'
        } else if (
          type_temp.includes('SENSOR') ||
          type_temp.includes('DETECTED') ||
          type_temp.includes('MOTION') ||
          type_temp.includes('DENIED') ||
          type_temp.includes('DENIED.')
        ) {
          row.type = 'red'
        } else {
          row.type = 'blue'
        }
        eventLogs.push(row)
      }
      this.renderLatest(eventLogs)
    }
    setTimeout(() => {
      updateCameraEventLogs(cameraEventViewInfo.accessInfo.DeviceID, latest_time, latestLogs => {
        this.updateLatest(latestLogs, latest_time)
      })
    }, 500)
  }

  initTable = () => {
    let eventLogs = []
    let { cameraEventViewInfo } = this.props
    let eventArray = cameraEventViewInfo.cameraEventLogs
    if (!init_flag && typeof eventArray !== 'undefined' && eventArray.length > 1) {
      let { sortType, sortOrder } = this.state
      if (sortType === 'datetime' && sortOrder === 0) {
        let latest_time = eventArray[0].DateTime
        updateCameraEventLogs(cameraEventViewInfo.accessInfo.DeviceID, latest_time, latestLogs => {
          this.updateLatest(latestLogs, latest_time)
        })
      }
      let { limit_count } = this.state
      let count = limit_count > eventArray.length ? eventArray.length : limit_count
      let start = 0
      let cur_eventArray = eventArray.slice(start, count)
      cur_eventArray.forEach(event => {
        let row = {}
        row.eventType = event.EventMsg.toUpperCase()
        row.datetime = new Date(event.DateTime)
          .toLocaleString('en-GB', { timeZone: 'UTC' })
          .replace(',', '')
        row.device = event.SecurityDevice.DeviceName.toUpperCase()
        row.location = event.SecurityDevice.DeckLocation.LocationName.toUpperCase()
        let type_temp = row.eventType.split(' ')
        if (type_temp.includes('GRANTED') || type_temp.includes('GRANTED.')) {
          row.type = 'green'
        } else if (
          type_temp.includes('SENSOR') ||
          type_temp.includes('DETECTED') ||
          type_temp.includes('MOTION') ||
          type_temp.includes('DENIED') ||
          type_temp.includes('DENIED.')
        ) {
          row.type = 'red'
        } else {
          row.type = 'blue'
        }
        eventLogs.push(row)
      })
      this.renderTable(eventLogs)
      if ($('#cameraEventTableContainer')) {
        $('#cameraEventTableContainer')
          .find('.tableArea')
          .css('display', 'block')
      }
      init_flag = true
    } else if (!init_flag && eventArray.length === 0) {
      setTimeout(() => {
        this.initTable()
      }, 500)
    }
  }

  onSortClick = type => {
    $('#cameraEventTableContainer')
      .find('.tableArea')
      .empty()
    $('#cameraEventTableContainer').scrollTop(0)
    $('#cameraEventTableContainer')
      .find('.tableArea')
      .css('display', 'none')
    let { sortType, sortOrder } = this.state
    let { dispatch, cameraEventViewInfo } = this.props
    if (sortType === type) {
      dispatch({
        type: 'INIT_CAMERA_EVENT_LOG',
      })
      getSecurityEventsByCameraId(
        cameraEventViewInfo.accessInfo.DeviceID,
        dispatch,
        type,
        1 - sortOrder,
      )
      setTimeout(() => {
        this.setState({
          sortOrder: 1 - sortOrder,
          limit_count: 50,
        })
      }, 500)
    } else {
      dispatch({
        type: 'INIT_CAMERA_EVENT_LOG',
        sortType: type,
        order: 1,
      })
      getSecurityEventsByCameraId(cameraEventViewInfo.accessInfo.DeviceID, dispatch, type, 1)
      setTimeout(() => {
        this.setState({
          sortType: type,
          sortOrder: 1,
          limit_count: 50,
        })
      }, 500)
    }
    init_flag = false
    eventRow_count = 50
    this.initTable()
  }

  handleScroll = e => {
    var node = e.target
    let { dispatch } = this.props
    if (node.scrollTop === 0) {
      scroll_flag = !scroll_flag
    } else {
      if (scroll_flag) {
        scroll_flag = !scroll_flag
      }
    }
    const bottom = node.scrollHeight - node.scrollTop - node.clientHeight
    if (bottom < 100) {
      update_flag = !update_flag
      let eventLogs = []
      let { cameraEventViewInfo } = this.props
      let eventArray = cameraEventViewInfo.cameraEventLogs
      let cur_eventArray = []
      let count = 0
      if (typeof eventArray !== 'undefined' && eventArray.length > 0) {
        count = eventRow_count + 50 > eventArray.length ? eventArray.length : eventRow_count + 50
        cur_eventArray = eventArray.slice(eventRow_count, count)
        eventRow_count = count > 0 ? count : eventRow_count
      }
      cur_eventArray.forEach(event => {
        let row = {}
        row.eventType = event.EventMsg.toUpperCase()
        row.datetime = new Date(event.DateTime)
          .toLocaleString('en-GB', { timeZone: 'UTC' })
          .replace(',', '')
        row.device = event.SecurityDevice.DeviceName.toUpperCase()
        row.location = event.SecurityDevice.DeckLocation.LocationName.toUpperCase()
        let type_temp = row.eventType.split(' ')
        if (type_temp.includes('GRANTED') || type_temp.includes('GRANTED.')) {
          row.type = 'green'
        } else if (
          type_temp.includes('SENSOR') ||
          type_temp.includes('DETECTED') ||
          type_temp.includes('MOTION') ||
          type_temp.includes('DENIED') ||
          type_temp.includes('DENIED.')
        ) {
          row.type = 'red'
        } else {
          row.type = 'blue'
        }
        eventLogs.push(row)
      })
      this.renderTable(eventLogs)
    }
  }

  renderLatest = eventLogs => {
    eventLogs.forEach(log => {
      let className = 'row eventRow'
      switch (log.type) {
        case 'red': {
          className += ' redRow'
          break
        }
        case 'green': {
          className += ' greenRow'
          break
        }
        case 'blue': {
          className += ' blueRow'
          break
        }
      }
      let new_row = $(
        `<div class="` +
        className +
        `">
                  <div class="col-3 eventItem">` +
        log.eventType +
        `</div>
                  <div class="col-3 eventItem">` +
        log.datetime +
        `</div>
                  <div class="col-3 eventItem">` +
        log.location +
        `</div>
                  <div class="col-3 eventItem">` +
        log.device +
        `</div>
                </div>`,
      )
      $('#cameraEventTableContainer')
        .find('.tableArea')
        .prepend(new_row)
    })
  }

  renderTable = eventLogs => {
    eventLogs.forEach(log => {
      let className = 'row eventRow'
      switch (log.type) {
        case 'red': {
          className += ' redRow'
          break
        }
        case 'green': {
          className += ' greenRow'
          break
        }
        case 'blue': {
          className += ' blueRow'
          break
        }
      }
      let new_row = $(
        `<div class="` +
        className +
        `">
                  <div class="col-3 eventItem">` +
        log.eventType +
        `</div>
                  <div class="col-3 eventItem">` +
        log.datetime +
        `</div>
                  <div class="col-3 eventItem">` +
        log.location +
        `</div>
                  <div class="col-3 eventItem">` +
        log.device +
        `</div>
                </div>`,
      )
      $('#cameraEventTableContainer')
        .find('.tableArea')
        .append(new_row)
    })
  }

  handleResizeStart = () => {
    console.log('ResizeStart')
    $('#CameraEventLogView').draggable('destroy')
  }

  handleResizeStop = () => {
    $('#CameraEventLogView').draggable({})
  }

  render() {
    let { border, sortType, sortOrder, x, y, width, height } = this.state
    let { cameraEventViewInfo } = this.props

    let display = cameraEventViewInfo.display ? 'block' : 'none'
    let cornerImage = ''
    if (border === 'blue') {
      cornerImage = 'resources/images/background/blue-corner.png'
    }
    return (
      <Resizable
        className={'CameraEventLogView'}
        id={'CameraEventLogView'}
        style={{ display: display }}
        onResizeStart={this.handleResizeStart}
        onResizeStop={this.handleResizeStop}
        enable={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        <div className={'captionArea'}>{cameraEventViewInfo.accessInfo && cameraEventViewInfo.accessInfo.DeviceName}</div>
        <div className={'sortArea'}>
          <div
            className={sortType === 'datetime' ? 'sortItem selected' : 'sortItem'}
            onClick={this.onSortClick.bind(this, 'datetime')}
          >
            {sortType === 'datetime' && sortOrder === 1 ? (
              <span className={'icon'}>
                <i className="fa fa-caret-down" />
              </span>
            ) : (
                <span className={'icon'}>
                  <i className="fa fa-caret-right" />
                </span>
              )}
            <span className={'sortType'}>Event Time</span>
          </div>
          <div
            className={sortType === 'eventType' ? 'sortItem selected' : 'sortItem'}
            onClick={this.onSortClick.bind(this, 'eventType')}
          >
            {sortType === 'eventType' && sortOrder === 1 ? (
              <span className={'icon'}>
                <i className="fa fa-caret-down" />
              </span>
            ) : (
                <span className={'icon'}>
                  <i className="fa fa-caret-right" />
                </span>
              )}
            <span className={'sortType'}>Event Type</span>
          </div>
          <div
            className={sortType === 'location' ? 'sortItem selected' : 'sortItem'}
            onClick={this.onSortClick.bind(this, 'location')}
          >
            {sortType === 'location' && sortOrder === 1 ? (
              <span className={'icon'}>
                <i className="fa fa-caret-down" />
              </span>
            ) : (
                <span className={'icon'}>
                  <i className="fa fa-caret-right" />
                </span>
              )}
            <span className={'sortType'}>Sort Elements</span>
          </div>
          <div
            className={sortType === 'device' ? 'sortItem selected' : 'sortItem'}
            onClick={this.onSortClick.bind(this, 'device')}
          >
            {sortType === 'device' && sortOrder === 1 ? (
              <span className={'icon'}>
                <i className="fa fa-caret-down" />
              </span>
            ) : (
                <span className={'icon'}>
                  <i className="fa fa-caret-right" />
                </span>
              )}
            <span className={'sortType'}>Sort Elements</span>
          </div>
        </div>
        <div className={'headerArea row'}>
          <div className={'col-3 headerItem'}>EVENT</div>
          <div className={'col-3 headerItem'}>DATE/TIME</div>
          <div className={'col-3 headerItem'}>LOCATION</div>
          <div className={'col-3 headerItem'}>DEVICE</div>
        </div>
        <div
          className={'cameraEvent_mainContainer'}
          id={'cameraEventTableContainer'}
          onScroll={this.handleScroll}
        >
          <div
            className={'tableArea'}
          />
        </div>
        <img src={cornerImage} className="cornerImage" alt="corner" />
        <button className={'closeButton'} onClick={this.onClose} />
      </Resizable>
    )
  }
}

export default CameraEventView
