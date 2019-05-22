import React from 'react'
import { connect } from 'react-redux'
import { getCameraInfoByDeviceId } from 'ducks/logHistory'
import { getSecurityEventsByDeviceID } from 'ducks/logHistory'
import logHistoryData from './logHistory-example'
import { accessStream } from './liveStream'
import { triggerManualEvent } from 'ducks/Milestone'
import $ from 'jquery'
import './style.scss'

const mapStateToProps = (state, props) => ({
  urls: state.urls,
  logInfo: state.logInfo,
  devicesInfo: state.devicesInfo,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
})

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class AccessControlView extends React.Component {
  state = {
    sortType: 'datetime',
    sortOrder: 0,
    selectRow: 0,
    limit_count: 20,
  }

  cameraController = null

  onClose = () => {
    let { dispatch } = this.props
    this.setState({
      sortType: 'datetime',
      sortOrder: 0,
      selectRow: 0,
      limit_count: 20,
    })
    let accessInfo = {
      enabled: false,
      AuxDeviceID: -1,
      ClearanceLevelID: -1,
      DeckNumber: -1,
      DeckName: '',
      DeckZoneID: -1,
      DeviceGUID: '',
      DeviceID: -1,
      DeviceName: '',
      EquipmentSubTypeID: -1,
      EquipmentTypeID: -1,
      LocationID: -1,
      LocationName: '',
      LocationX: 0,
      LocationY: 0,
      count: -1,
    }
    //this.cameraController.image.src = null;
    $('#cameraLoadingArea')[0].style.display = 'flex'
    console.log('cameracontroller: ', this.cameraController)
    if (this.cameraController) {
      this.cameraController.closeVideoConnection()
      this.cameraController.Id = ''
      this.cameraController.drawing = false
      this.cameraController.loading = true
    }
    // delete this.cameraController;
    // this.cameraController = null;
    dispatch({
      type: 'CLEAR_DATA',
      accessInfo: accessInfo,
    })
  }

  onScroll = e => {
    e.preventDefault()
    var node = e.target
    const bottom = node.scrollHeight - node.scrollTop - node.clientHeight
    if (bottom < 10) {
      let { limit_count } = this.state
      this.setState({
        limit_count: limit_count + 10,
      })
    }
    console.log(bottom)
  }

  filterButtonClick = type => {
    console.log(type)
    if (type === 'time') {
      let { sortType, sortOrder } = this.state
      if (sortType === type) {
        this.setState({
          sortOrder: 1 - sortOrder,
        })
      } else {
        this.setState({
          sortType: type,
          sortOrder: 1,
        })
      }
    } else {
      let { sortType, sortOrder } = this.state
      let order = 1
      if (sortType === type) {
        order = 1 - sortOrder
      }

      this.setState({
        sortType: type,
        sortOrder: order,
      })

      // let accessInfo = this.props.logInfo.accessInfo;
      // let { dispatch } = this.props;
      // dispatch({
      //     type: "INIT_DEVICE_EVENT_LOG"
      // });
      // getSecurityEventsByDeviceID(accessInfo, dispatch, type, order);
    }
  }

  onLogHistoryRowClick = index => {
    this.setState({
      selectRow: index - 1,
    })
  }

  render() {
    let accessLogoImage = 'resources/images/icons/accessControl/Access Control Logo.svg'
    let accessInfo = this.props.logInfo.accessInfo
    let logHistory = this.props.logInfo.logHistory
    let { limit_count } = this.state
    let rowCount = limit_count > logHistory.length ? logHistory.length : limit_count
    //if(accessInfo.count !== logHistoryArray.length) return(<div/>);
    let roomName = 'GUEST CABIN1'
    let deckName = 'DECK 4'
    let clearanceLevel = 0
    let userId = '47.52.45'
    let src = ''
    let loadIconShow = 'flex'
    let display = 'none'
    let { sortType, sortOrder, selectRow } = this.state
    let borderRadiusAreaDisplay = 'none'
    let historyTableBottom = 'historyTable radius'
    if (rowCount > 10) {
      borderRadiusAreaDisplay = 'block'
      historyTableBottom = 'historyTable'
    }
    if (typeof accessInfo !== 'undefined' && accessInfo.hasOwnProperty('enabled')) {
      // display = accessInfo.enabled ? 'block' : 'none'
      display = 'block'
      roomName = accessInfo.LocationName
      deckName = accessInfo.DeckName
      let deviceID = accessInfo.DeviceID
      let deviceAttributes = this.props.logInfo.deviceAttributeArray
      let cur_device = deviceAttributes.find(attribute => {
        return attribute.SecurityDeviceID === deviceID
      })
      if (cur_device && cur_device.AttributeNameID === 18) {
        let cameraName = cur_device.AttributeValue
        let cameras = this.props.urls.cameras
        let curCamera = cameras.find(camera => {
          return camera.Name === cameraName
        })
        if (typeof curCamera !== 'undefined' && curCamera.hasOwnProperty('Id')) {
          if (!this.cameraController) {
            this.cameraController = new accessStream(curCamera)
          } else {
            if (this.cameraController.Id !== curCamera.Id) {
              this.cameraController.Id = curCamera.Id
              this.cameraController.requestStream()
            }
          }
        }
      }
      document.getElementById('root').style.cursor = 'default'
      triggerManualEvent()
    }
    let index = 0
    switch (sortType) {
      case 'datetime': {
        if (sortOrder === 0) {
          logHistory.sort((a, b) => {
            let t_1 = new Date(a.datetime).getTime()
            let t_2 = new Date(b.datetime).getTime()
            return t_2 - t_1
          })
        } else {
          logHistory.sort((a, b) => {
            let t_1 = new Date(a.datetime).getTime()
            let t_2 = new Date(b.datetime).getTime()
            return t_1 - t_2
          })
        }
        break
      }
      case 'date': {
        if (sortOrder === 0) {
          console.log('SortOrder: Date', sortOrder)
          logHistory.sort((a, b) => {
            let t_1 = new Date(a.datetime).getTime()
            let t_2 = new Date(b.datetime).getTime()
            return t_2 - t_1
          })
        } else {
          console.log('SortOrder: Date', sortOrder)
          logHistory.sort((a, b) => {
            let t_1 = new Date(a.datetime).getTime()
            let t_2 = new Date(b.datetime).getTime()
            return t_1 - t_2
          })
        }
        break
      }
      case 'time': {
        if (sortOrder === 0) {
          logHistory.sort((a, b) => {
            let t_1 = new Date(logHistoryData[0].date + ' ' + a.time).getTime()
            let t_2 = new Date(logHistoryData[0].date + ' ' + b.time).getTime()
            return t_2 - t_1
          })
        } else {
          logHistory.sort((a, b) => {
            let t_1 = new Date(logHistoryData[0].date + ' ' + a.time).getTime()
            let t_2 = new Date(logHistoryData[0].date + ' ' + b.time).getTime()
            return t_1 - t_2
          })
        }
        break
      }
      case 'operator': {
        if (sortOrder === 0) {
          logHistory.sort((a, b) => {
            return b.operator === a.operator ? 0 : b.operator > a.operator ? -1 : 1
          })
        } else {
          logHistory.sort((a, b) => {
            return b.operator === a.operator ? 0 : b.operator < a.operator ? -1 : 1
          })
        }
        break
      }
      case 'access': {
        if (sortOrder === 0) {
          logHistory.sort((a, b) => {
            return b.access === a.access ? 0 : b.access > a.access ? -1 : 1
          })
        } else {
          logHistory.sort((a, b) => {
            return b.access === a.access ? 0 : b.access < a.access ? -1 : 1
          })
        }
        break
      }
    }
    let logHistoryArray = logHistory.slice(0, rowCount)
    let userName = logHistoryArray[selectRow] ? logHistoryArray[selectRow].operator : ''
    let memberId = logHistoryArray[selectRow] ? logHistoryArray[selectRow].memberId : ''
    let clearanceId = logHistoryArray[selectRow] ? logHistoryArray[selectRow].clearanceId : ''
    return (
      <div className={'AccessControlModal DataCard bg-transparent'} style={{ display: display }}>
        <div className={'AccessContainer'}>
          <div className={'CameraArea DataCard bg-transparent'}>
            <img src={src} className={'accessImage'} id={'accessPointCamera'} alt="cameraImage" />
            <div
              className={'cameraLoadingArea'}
              id={'cameraLoadingArea'}
              style={{ display: loadIconShow }}
            >
              <span className={'rotationArea'}>
                <img
                  className={'rotationIcon'}
                  src={'resources/images/icons/graphic-spinner.svg'}
                />
              </span>
            </div>
          </div>
          <div className={'LogoArea'}>
            <img className={'AccessLogo'} src={accessLogoImage} />
          </div>
          <div className={'LocationArea'}>
            <span className={'caption'}>LOCATION</span>
            <div className={'LocationTable'}>
              <div className={'row header'}>
                <div className={'col-6'}>Room</div>
                <div className={'col-6'}>Deck</div>
              </div>
              <div className={'row content'}>
                <div className={'first col-6'}>{roomName}</div>
                <div className={'col-6'}>{deckName}</div>
              </div>
            </div>
          </div>
          <div className={'ClearanceArea'}>
            <span className={'caption'}>CLEARANCE</span>
            <div className={'levelBar'}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
                let className = 'levelButton level-' + i
                if (i === clearanceId) {
                  className += ' currentLevel'
                }
                return <div className={className}>{i}</div>
              })}
            </div>
          </div>
          <div className={'NameArea'}>
            <div className={'row'}>
              <div className={'col-6'}>
                <div className={'caption'}>NAME</div>
                <div className={'contentField'}>{userName}</div>
              </div>
              <div className={'col-6'}>
                <div className={'caption'}>MEMBER ID</div>
                <div className={'contentField'}>{memberId}</div>
              </div>
            </div>
          </div>
          <div className={'LogHistoryArea'}>
            <span className={'caption'}>LOG HISTORY</span>
            <div className={'historyTableHeader row'}>
              <div className={'col-3'}>
                <span
                  className={'filterButton'}
                  onClick={this.filterButtonClick.bind(this, 'date')}
                >
                  {sortType === 'date' && sortOrder === 1 ? (
                    <span>
                      <i className="fa fa-caret-down" />
                    </span>
                  ) : (
                    <span>
                      <i className="fa fa-caret-right" />
                    </span>
                  )}
                  Date
                </span>
              </div>
              <div className={'col-3'}>
                <span
                  className={'filterButton'}
                  onClick={this.filterButtonClick.bind(this, 'time')}
                >
                  {sortType === 'time' && sortOrder === 1 ? (
                    <span>
                      <i className="fa fa-caret-down" />
                    </span>
                  ) : (
                    <span>
                      <i className="fa fa-caret-right" />
                    </span>
                  )}
                  Time
                </span>
              </div>
              <div className={'col-3'}>
                <span
                  className={'filterButton'}
                  onClick={this.filterButtonClick.bind(this, 'operator')}
                >
                  {sortType === 'operator' && sortOrder === 1 ? (
                    <span>
                      <i className="fa fa-caret-down" />
                    </span>
                  ) : (
                    <span>
                      <i className="fa fa-caret-right" />
                    </span>
                  )}
                  Operator
                </span>
              </div>
              <div className={'col-3 last'}>
                <span
                  className={'filterButton'}
                  onClick={this.filterButtonClick.bind(this, 'access')}
                >
                  {sortType === 'access' && sortOrder === 1 ? (
                    <span>
                      <i className="fa fa-caret-down" />
                    </span>
                  ) : (
                    <span>
                      <i className="fa fa-caret-right" />
                    </span>
                  )}
                  Access
                </span>
              </div>
            </div>
          </div>
          <div className={'historyTableArea'} onScroll={this.onScroll}>
            <div className={historyTableBottom}>
              {logHistoryArray.map(data => {
                index++
                let date = data.date
                let time = data.time
                let operator = data.operator
                let access = data.access
                let isLast = data.isLast || false

                let access_cell = 'col-3 last'
                if (access === 'GRANTED') {
                  access_cell += ' g_color'
                } else if (access === 'DECLINED') {
                  access_cell += ' r_color'
                }
                let className = 'row'
                if (index === selectRow + 1) {
                  className += ' selectRow'
                }
                if (index === logHistoryArray.length && index < 10) {
                  className += ' radius'
                }
                return (
                  <div className={className} onClick={this.onLogHistoryRowClick.bind(this, index)}>
                    <div className={'col-3'}>{date}</div>
                    <div className={'col-3'}>{time}</div>
                    <div className={'col-3'}>{operator}</div>
                    <div className={access_cell}>{access}</div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className={'bottomRadius row'} style={{ display: borderRadiusAreaDisplay }}>
            <div className={'col-3'} />
            <div className={'col-3'} />
            <div className={'col-3'} />
            <div className={'col-3 last'} />
          </div>
        </div>
        <button className={'closeButton'} onClick={this.onClose} />
      </div>
    )
  }
}
export default AccessControlView
