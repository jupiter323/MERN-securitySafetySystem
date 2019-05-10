import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { pendingTasksReducer } from 'react-redux-spinner'
import app from './app'
import login from './login'
import dumpsters from './dumpster'
import xpMobile from './Milestone'
import decksInfo from './decks'
import devicesInfo from './devices'
import deckLocationInfo from './deckLocations'
import widgetInfo from './widget'
import logInfo from './logHistory'
import deckZonesInfo from './deckZones'
import eventInfo from './event'
import systemInfo from './system'
import cameraEventViewInfo from './CameraEventView'

export default combineReducers({
  routing: routerReducer,
  pendingTasks: pendingTasksReducer,
  dumpsters: dumpsters,
  urls: xpMobile,
  decksInfo: decksInfo,
  devicesInfo: devicesInfo,
  deckLocationsInfo: deckLocationInfo,
  widgetInfo: widgetInfo,
  logInfo: logInfo,
  deckZonesInfo: deckZonesInfo,
  eventInfo: eventInfo,
  systemInfo: systemInfo,
  cameraEventViewInfo: cameraEventViewInfo,
  app,
  login,
})
