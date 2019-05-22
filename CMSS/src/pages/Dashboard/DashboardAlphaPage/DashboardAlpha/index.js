import React from 'react'
import { connect } from 'react-redux'
import ReactDom from 'react-dom'
import SplashScreen from './SplashScreen/index'
import { message } from 'antd'

import _ from 'lodash'

import TopMenu from './TopMenu/index'
import CameraView from './CameraView/index'
import DeckView from './DeckView/index'
import EventView from './EventView/index'
import SensorView from './SensorView/index'
import PlaybackView from './PlaybackView/index'
import AccessControlView from './AccessControlView/index'
import CameraEventView from './CameraEventView/index'

import 'react-datepicker/dist/react-datepicker.css'
import './style.scss'

import { WidthProvider, Responsive } from 'react-grid-layout'

import { connectToMilestone } from 'ducks/app'
import { getAllDecks } from 'ducks/decks'
import { getAllDevices } from 'ducks/devices'
import { getAllDeckLocations } from 'ducks/deckLocations'
import { getAllDeckZones } from 'ducks/deckZones'
import { getAllSecurityEvents } from 'ducks/event'
import { getAllDeviceAttributes } from 'ducks/logHistory'

import ReactSwipeEvents from 'react-swipe-events'

const mapDispatchToProps = (dispatch, props) => ({
  dispatch: dispatch,
})

const mapStateToProps = (state, props) => ({
  urls: state.urls,
  devicesInfo: state.devicesInfo,
  widgetInfo: state.widgetInfo,
  accessInfo: state.accessInfo,
  eventInfo: state.eventInfo,
  logInfo: state.logInfo,
  cameraEventViewInfo: state.cameraEventViewInfo
})

const ResponsiveReactGridLayout = WidthProvider(Responsive)
const sw_value = 400
const defaultProps = {
  className: 'layout',
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  rowHeight: 139,
  margin: [2, 2],
}
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class DashboardAlpha extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      day: new Date(),
      items: [0, 1, 2, 3, 4].map(function (i, key, list) {
        return {
          i: i.toString(),
          x: i * 2,
          y: 0,
          w: 2,
          h: 2,
        }
      }),
      display: false,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {
    //requestAllStreams(this.state.cameras);
    let { dispatch, widgetInfo, urls } = this.props
    connectToMilestone(
      dispatch,
      () => {
        let cameras = urls.cameras
        dispatch({
          type: 'SET_PLAYBACK_VIEW',
          playbackView: { visible: true },
        })
        dispatch({
          type: 'SET_DECK_VIEW',
          deckView: { visible: true },
        })
        dispatch({
          type: 'SET_SENSOR_VIEW',
          sensorView: { visible: true },
        })
        dispatch({
          type: 'SET_EVENT_VIEW',
          eventView: { visible: true },
        })

        let cameraViews = []
        cameras.map(camera => {
          cameraViews.push({
            id: camera.Id,
            visible: true,
          })
        })
        dispatch({
          type: 'SET_CAMERA_VIEWS',
          cameraViews: cameraViews,
        })
        let items = []
        const camera_count = cameras.length
        const cols = 3
        const w = 3
        const h = 2
        if (camera_count > 0) {
          for (let i = 0; i < camera_count; i++) {
            items.push({
              i: 'cameraView-' + cameras[i].Id,
              x: (cols - (i % cols) - 1) * w,
              y: Math.floor(i / cols) * h,
              w: w,
              h: h,
            })
          }
        }
        items.push({
          i: 'sensorView',
          x: cols * w,
          y: 0,
          w: 3,
          h: 4,
          draggable: true,
        })
        items.push({
          i: 'playbackView',
          x: cols * w,
          y: 4,
          w: 3,
          h: 4,
        })
        items.push({
          i: 'deckView',
          x: 0,
          y: Math.ceil(camera_count / 3) * h,
          w: 8,
          h: 3,
        })
        items.push({
          i: 'eventView',
          x: 8,
          y: Math.ceil(camera_count / 3) * h,
          w: 4,
          h: 3,
          minW: 4,
          minH: 3,
        })
        this.setState({
          items: items,
          display: true,
        })
      },
      () => {
        console.log('Failed to connect milestone server')
      },
    )
    getAllDecks(dispatch)
    getAllDevices(dispatch)
    getAllDeckLocations(dispatch)
    getAllDeckZones(dispatch)
    dispatch({
      type: 'INIT_EVENT_LOG',
    })
    //getAllSecurityEvents(dispatch)
    getAllDeviceAttributes(dispatch)
  }

  setSensorViewDraggable = flag => {
    /*let { layout } = this.state;
        let sensorItem = layout.find(item => {
            return item.i === 'sensorView'
        });
        sensorItem.isDraggable = flag;
        this.setState({
            layout: layout
        });*/
  }

  handleChange = date => {
    this.setState({ day: date })
  }

  addCameraView = cameraId => {
    let { items } = this.state
    let { dispatch, widgetInfo } = this.props
    let cameraViews = widgetInfo.cameraViews
    this.setState({
      // Add a new item. It must have a unique key!
      items: items.concat({
        i: 'cameraView-' + cameraId,
        x: 0,
        y: 0,
        w: 3,
        h: 2,
      }),
    })
    let newCameraViews = cameraViews.filter(cameraView => {
      return cameraView.id !== cameraId
    })
    newCameraViews.push({ id: cameraId, visible: true })
    dispatch({
      type: 'SET_CAMERA_VIEWS',
      cameraViews: newCameraViews,
    })
  }

  addDeckView = () => {
    console.log('Adding Deck View: ')
    let { dispatch } = this.props
    let { items } = this.state
    this.setState({
      // Add a new item. It must have a unique key!
      items: items.concat({
        i: 'deckView',
        x: 0,
        y: 100,
        w: 8,
        h: 3,
      }),
    })
    dispatch({
      type: 'SET_DECK_VIEW',
      deckView: { visible: true },
    })
  }

  addEventView = () => {
    console.log('Adding Event View: ')
    let { items } = this.state
    this.setState({
      // Add a new item. It must have a unique key!
      items: items.concat({
        i: 'eventView',
        x: 8,
        y: 100,
        w: 4,
        h: 3,
        minW: 4,
        minH: 3,
      }),
    })
  }

  addSensorView = () => {
    console.log('Adding Sensor View: ')
    let { items } = this.state
    this.setState({
      // Add a new item. It must have a unique key!
      items: items.concat({
        i: 'sensorView',
        x: 9,
        y: 0,
        w: 3,
        h: 4,
      }),
    })
  }

  addPlaybackView = () => {
    console.log('Adding PlaybackView: ')
    let { items } = this.state
    this.setState({
      // Add a new item. It must have a unique key!
      items: items.concat({
        i: 'playbackView',
        x: 9,
        y: 4,
        w: 3,
        h: 4,
      }),
    })
  }

  createElement = el => {
    let playbackCamera = this.props.urls.playbackCamera
    let playbackClassName = 'DataCard bg-transparent'
    if (typeof playbackCamera !== 'undefined' && playbackCamera.hasOwnProperty('Id')) {
      playbackClassName += ' green'
    }
    const { cameras } = this.props.urls
    let { day } = this.state
    const id = el.i
    const type = id.split('-')[0]
    switch (type) {
      case 'cameraView': {
        let cameraId = id.replace('cameraView-', '')
        let className = 'DataCard camera bg-transparent'
        let isPlayback = false
        if (typeof playbackCamera !== 'undefined' && playbackCamera.hasOwnProperty('Id')) {
          if (playbackCamera.Id === cameraId) {
            isPlayback = true
            className += ' green'
          }
        }
        let camera = cameras.find(camera => {
          return camera.Id === cameraId
        })
        return (
          <div className={className} key={id} data-grid={el}>
            <ReactSwipeEvents
              onSwiped={(e, originalX, originalY, currentX, currentY) => {
                let dis = Math.sqrt(
                  Math.pow(currentX - originalX, 2) + Math.pow(currentY - originalY, 2),
                )
                if (dis > sw_value) {
                  this.onRemoveItem(id)
                }
              }}
            >
              <CameraView camera={camera} isPlayBack={isPlayback} />
              <button className={'closeButton'} onClick={this.onRemoveItem.bind(this, id)} />
            </ReactSwipeEvents>
          </div>
        )
      }
      case 'deckView': {
        return (
          <div className={'DataCard bg-transparent DeckViewContainer'} key={id} data-grid={el}>
            <ReactSwipeEvents
              onSwiped={(e, originalX, originalY, currentX, currentY) => {
                let dis = Math.sqrt(
                  Math.pow(currentX - originalX, 2) + Math.pow(currentY - originalY, 2),
                )
                if (dis > sw_value) {
                  this.onRemoveItem(id)
                }
              }}
            >
              <DeckView addCameraView={this.addCameraView} />
              <button className={'closeButton'} onClick={this.onRemoveItem.bind(this, id)} />
            </ReactSwipeEvents>
          </div>
        )
      }
      case 'sensorView': {
        return (
          <div
            className={'DataCard bg-transparent'}
            key={id}
            data-grid={el}
            onReset={() => {
              console.log('resizing:')
            }}
            onresize={this.handleResize}
          >
            <ReactSwipeEvents
              onSwiped={(e, originalX, originalY, currentX, currentY) => {
                let dis = Math.sqrt(
                  Math.pow(currentX - originalX, 2) + Math.pow(currentY - originalY, 2),
                )
                if (dis > sw_value) {
                  this.onRemoveItem(id)
                }
              }}
            >
              <SensorView setSensorViewDraggable={this.setSensorViewDraggable} />
              <button className={'closeButton'} onClick={this.onRemoveItem.bind(this, id)} />
            </ReactSwipeEvents>
          </div>
        )
      }
      case 'playbackView': {
        return (
          <div className={playbackClassName} key={id} data-grid={el}>
            <ReactSwipeEvents
              onSwiped={(e, originalX, originalY, currentX, currentY) => {
                let dis = Math.sqrt(
                  Math.pow(currentX - originalX, 2) + Math.pow(currentY - originalY, 2),
                )
                if (dis > sw_value) {
                  this.onRemoveItem(id)
                }
              }}
            >
              <PlaybackView playbackCamera={playbackCamera} />
              <button className={'closeButton'} onClick={this.onRemoveItem.bind(this, id)} />
            </ReactSwipeEvents>
          </div>
        )
      }
      case 'eventView': {
        return (
          <div className={'DataCard bg-transparent EventView'} key={id} data-grid={el}>
            <ReactSwipeEvents
              onSwiped={(e, originalX, originalY, currentX, currentY) => {
                let dis = Math.sqrt(
                  Math.pow(currentX - originalX, 2) + Math.pow(currentY - originalY, 2),
                )
                if (dis > sw_value) {
                  this.onRemoveItem(id)
                }
              }}
            >
              <EventView />
              <button className={'closeButton'} onClick={this.onRemoveItem.bind(this, id)} />
            </ReactSwipeEvents>
          </div>
        )
      }
    }
  }

  onBreakpointChange = (breakpoint, cols) => {
    this.setState({
      breakpoint: breakpoint,
      cols: cols,
    })
  }

  onLayoutChange = layout => {
    //this.props.onLayoutChange(layout);
    this.setState({ layout: layout })
    console.log('OnLayoutChange: ', this.state.layout)
  }

  onRemoveItem = i => {
    console.log('removing', i)
    let { dispatch } = this.props
    let { items } = this.state
    switch (i) {
      case 'playbackView': {
        dispatch({
          type: 'SET_PLAYBACK_VIEW',
          playbackView: { visible: false },
        })
        break
      }
      case 'eventView': {
        dispatch({
          type: 'SET_EVENT_VIEW',
          eventView: { visible: false },
        })
        break
      }
      case 'deckView': {
        dispatch({
          type: 'SET_DECK_VIEW',
          deckView: { visible: false },
        })
        break
      }
      case 'sensorView': {
        dispatch({
          type: 'SET_SENSOR_VIEW',
          sensorView: { visible: false },
        })
        break
      }
      default: {
        let cameraId = i.replace('cameraView-', '')
        let cameraViews = this.props.widgetInfo.cameraViews
        let newInfo = []
        cameraViews.map(cameraView => {
          if (cameraView.id === cameraId) {
            newInfo.push({
              id: cameraId,
              visible: false,
            })
          } else {
            newInfo.push(cameraView)
          }
        })
        dispatch({
          type: 'SET_CAMERA_VIEWS',
          cameraViews: newInfo,
        })
        break
      }
    }
    this.setState({ items: _.reject(items, { i: i }) })
  }

  render() {
    let { items, display } = this.state
    let t_width = document.body.clientWidth
    let r_height = Math.round(((t_width / 4 / 16) * 9) / 2)
    let grid_lay_conf = defaultProps
    if (grid_lay_conf.rowHeight) {
      grid_lay_conf.rowHeight = r_height
    }
    let { accessInfo, cameraEventViewInfo, logInfo} = this.props
    return (
      <div id={"mainContainer"}>
        <TopMenu
          addCameraView={this.addCameraView}
          addDeckView={this.addDeckView}
          addEventView={this.addEventView}
          addSensorView={this.addSensorView}
          addPlaybackView={this.addPlaybackView}
          removeView={this.onRemoveItem}
        />
        {display ?
          (
            <ResponsiveReactGridLayout
              onLayoutChange={this.onLayoutChange}
              onBreakpointChange={this.onBreakpointChange}
              {...grid_lay_conf}
            >
              {_.map(items, el => this.createElement(el))}
            </ResponsiveReactGridLayout>
          ) : (
            <SplashScreen />
          )}
        {logInfo && logInfo.enabled && <AccessControlView accessInfo={accessInfo} />}
        {cameraEventViewInfo.display && <CameraEventView />}
      </div>
    )
  }
}

export default DashboardAlpha
