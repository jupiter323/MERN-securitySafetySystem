import React from 'react'
import { connect } from 'react-redux'
import { getAllSecurityEvents, updateEventLogs } from 'ducks/event'
import $ from 'jquery'
import './style.scss'

let scroll_flag = true
let update_flag = true
let eventRow_count = 50
let init_flag = false

const mapStateToProps = (state, props) => ({
  urls: state.urls,
  eventInfo: state.eventInfo,
  devicesInfo: state.devicesInfo,
  deckLocationsInfo: state.deckLocationsInfo,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
})

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class EventView extends React.Component {
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
    let { dispatch } = this.props
    getAllSecurityEvents(dispatch, 'datetime', 0);
  }

  componentDidUpdate() {
    if (!init_flag) {
      this.initTable()
    }
  }

  componentWillUnmount() {
    $('#eventTableContainer')
      .find('.tableArea')
      .empty()
    $('#eventTableContainer').scrollTop(0)
    $('#eventTableContainer').find('.tableArea')
    let { dispatch } = this.props
    dispatch({
      type: 'INIT_EVENT_LOG',
    })
    getAllSecurityEvents(dispatch, 'datetime', 0)
  }

  updateLatest = (latestLogs, latest_time) => {
    let { sortType, sortOrder } = this.state
    if (!$('#eventTableContainer')[0]) return
    let scrollTop = $('#eventTableContainer')[0].scrollTop
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
            type_temp.includes('DRONE') ||
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
      updateEventLogs(latest_time, latestLogs => {
        this.updateLatest(latestLogs, latest_time)
      })
    }, 500)
  }

  initTable = () => {
    let eventLogs = []
    let { eventInfo } = this.props
    let eventArray = eventInfo.eventLogs
    if (!init_flag && typeof eventArray !== 'undefined' && eventArray.length > 0) {
      let { sortType, sortOrder } = this.state
      if (sortType === 'datetime' && sortOrder === 0) {
        let latest_time = eventArray[0].DateTime
        updateEventLogs(latest_time, latestLogs => {
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
            type_temp.includes('DRONE') ||
            type_temp.includes('DENIED.')
        ) {
          row.type = 'red'
        } else {
          row.type = 'blue'
        }
        eventLogs.push(row)
      })
      this.renderTable(eventLogs)
      if ($('#eventTableContainer')) {
        $('#eventTableContainer')
          .find('.tableArea')
          .css('display', 'block')
      }
      init_flag = true
    } else if (!init_flag && eventArray.length === 0) {
      setTimeout(() => {
        this.initTable()
      }, 100)
    }
  }

  onSortClick = type => {
    $('#eventTableContainer')
      .find('.tableArea')
      .empty()
    $('#eventTableContainer').scrollTop(0)
    $('#eventTableContainer')
      .find('.tableArea')
      .css('display', 'none')
    let { sortType, sortOrder } = this.state
    let { dispatch } = this.props
    if (sortType === type) {
      dispatch({
        type: 'INIT_EVENT_LOG',
      })
      getAllSecurityEvents(dispatch, type, 1 - sortOrder)
      setTimeout(() => {
        this.setState({
          sortOrder: 1 - sortOrder,
          limit_count: 50,
        })
      }, 500)
    } else {
      dispatch({
        type: 'INIT_EVENT_LOG',
        sortType: type,
        order: 1,
      })
      getAllSecurityEvents(dispatch, type, 1)
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
      let { eventInfo } = this.props
      let eventArray = eventInfo.eventLogs
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
          type_temp.includes('DRONE') ||
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
      $('#eventTableContainer')
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
      $('#eventTableContainer')
        .find('.tableArea')
        .append(new_row)
    })
  }

  render() {
    let { border, sortType, sortOrder } = this.state
    let cornerImage = ''
    if (border === 'blue') {
      cornerImage = 'resources/images/background/blue-corner.png'
    }

    return (
      <div className="EventLogView">
        <div className={'captionArea'}>EVENT LOG</div>
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
            <span className={'sortType'}>Location</span>
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
            <span className={'sortType'}>Device Type</span>
          </div>
        </div>
        <div className={'headerArea row'}>
          <div className={'col-3 headerItem'}>EVENT</div>
          <div className={'col-3 headerItem'}>DATE/TIME</div>
          <div className={'col-3 headerItem'}>LOCATION</div>
          <div className={'col-3 headerItem'}>DEVICE</div>
        </div>
        <div className={'mainContainer'} id={'eventTableContainer'} onScroll={this.handleScroll}>
          <div className={'tableArea'} />
        </div>
        <img src={cornerImage} className="cornerImage" alt="corner" />
      </div>
    )
  }
}

export default EventView
