import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import rootReducer from 'ducks/redux'
import $ from 'jquery'
import cookie from 'react-cookie'

import './style.scss'
import { message } from 'antd'

let socketUrl = rootReducer.socketUrl

const mapStateToProps = (state, props) => ({
  deckZonesInfo: state.deckZonesInfo,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
})

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class DeckSensorPopup extends React.Component {
  ws = new WebSocket(socketUrl)
  socketOpened = false

  state = {
    expandedList: [],
  }

  componentDidMount() {
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
          case 'DeckSensorAllEnable': {
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
          case 'DeckSensorAllEnable': {
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

    setTimeout(() => {
      if (!this.socketOpened) {
        //message.error('Cannot connect to Safety and Security System.');
      }
    }, 2000)
  }

  dropDownItemClick = number => {
    let { expandedList } = this.state
    if (!expandedList.includes(number)) {
      expandedList.push(number)
    } else {
      let index = expandedList.indexOf(number)
      console.log(index)
      expandedList.splice(index, 1)
    }
    this.setState({
      expandedList: expandedList,
    })
  }

  allDeckSensor = type => {
    if (!this.socketOpened) {
      this.openSocket()
      message.error('Socket is disconnected! ...Please try again.')
    } else {
      let user = cookie.load('UserName')
      let messageInfo = '<DeckSensorAllEnable><' + user + '><'
      switch (type) {
        case 0: {
          messageInfo += 'Enable>'
          break
        }
        case 1: {
          messageInfo += 'Disable>'
          break
        }
      }
      this.ws.send(messageInfo)
    }
  }

  deckSensorByZone = (deckZone, type) => {
    console.log('DeckZone: ', deckZone)
    if (!this.socketOpened) {
      this.openSocket()
      message.error('Socket is disconnected! ...Please try again.')
    } else {
      let { currentDeck } = this.props
      let deckName = currentDeck.DeckName
      let deckZoneName = deckZone.DeckZoneName
      let user = cookie.load('UserName')
      let messageInfo =
        '<DeckSensorZoneEnable><' + user + '><' + deckName + '><' + deckZoneName + '><'
      switch (type) {
        case 0: {
          messageInfo += 'Enable>'
          break
        }
        case 1: {
          messageInfo += 'Disable>'
          break
        }
      }
      console.log('messageInfo:', messageInfo)
      this.ws.send(messageInfo)
    }
  }

  render() {
    let { displayInfo, deckZonesInfo, currentDeck } = this.props
    let { display, left, top } = displayInfo
    let { expandedList } = this.state
    let curDeckNumber = currentDeck.DeckNumber
    let deckZones = deckZonesInfo.deckZones.filter(zone => {
      return zone.DeckNumber === curDeckNumber
    })
    let deckView = $('#DeckViewController')
    let absolute_top =
      typeof deckView.parents()[1] !== 'undefined' ? $(deckView.parents()[1]).position().top : 0
    return (
      <div
        className={'DeckSensorPopup'}
        style={{
          display: display,
          left: left + 15 < 100 ? left + 1 + '%' : left - 16 + '%',
          top: absolute_top < 100 ? top + 5 + '%' : top - 100 + '%',
        }}
      >
        <div className={'caption'}>DECK SENSORS</div>
        <ul className="popupArea">
          <li>
            <div className="dropdownItem" onClick={this.dropDownItemClick.bind(this, 0)}>
              <i
                className={
                  !expandedList.includes(0)
                    ? 'fa fa-caret-right parentItem'
                    : 'fa fa-caret-down parentItem'
                }
                aria-hidden="true"
              />
              <span className={'subTitle'}>{'ALL'}</span>
            </div>
            <ul
              className="submenuItems"
              style={expandedList.includes(0) ? { display: 'block' } : { display: 'none' }}
            >
              <li onClick={this.allDeckSensor.bind(this, 0)}>
                <div className={'listItem functionItem'}>{'ON'}</div>
              </li>
              <li onClick={this.allDeckSensor.bind(this, 1)}>
                <div className={'listItem functionItem'}>{'OFF'}</div>
              </li>
            </ul>
          </li>
          <li>
            <div className="dropdownItem" onClick={this.dropDownItemClick.bind(this, 1)}>
              <i
                className={
                  !expandedList.includes(1)
                    ? 'fa fa-caret-right parentItem'
                    : 'fa fa-caret-down parentItem'
                }
                aria-hidden="true"
              />
              <span className={'subTitle'}>{'BY ZONE'}</span>
            </div>
            <ul
              className="submenuItems"
              style={expandedList.includes(1) ? { display: 'block' } : { display: 'none' }}
            >
              {deckZones.map(deckZone => {
                if (deckZone.DeckZoneName === 'No Zone') return <div />
                return (
                  <li>
                    <div className={'listItem subCaption'}>{deckZone.DeckZoneName}</div>
                    <div
                      className={'listItem functionItem'}
                      onClick={this.deckSensorByZone.bind(this, deckZone, 0)}
                    >
                      {'ON'}
                    </div>
                    <div
                      className={'listItem functionItem'}
                      onClick={this.deckSensorByZone.bind(this, deckZone, 1)}
                    >
                      {'OFF'}
                    </div>
                  </li>
                )
              })}
            </ul>
          </li>
        </ul>
      </div>
    )
  }
}

export default DeckSensorPopup
