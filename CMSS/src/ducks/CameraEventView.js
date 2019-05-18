import axios from 'axios'
import rootReducer from './redux'

const INITIAL_STATE = {
  display: false,
  cameraInfo: {},
  sortType: 'datetime',
  order: 0,
  cameraEventLogs: [],
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_CAMERA_EVENT_VIEW_DISPLAY': {
      console.log("CameraEventPopup")
      return {
        ...state,
        ...(state.display = action.display),
        ...(state.cameraEventLogs = []),
        ...(state.cameraInfo = action.cameraInfo),
      }
    }
    case 'CLOSE_CAMERA_EVENT_VIEW_DISPLAY': {
      return {
        ...state,        
        ...(state.cameraEventLogs = []),
        ...(state.cameraInfo = {}),
        ...(state.sortType = 'datetime'),
        ...(state.order = 0),
        ...(state.display = false),
      }
    }
    case 'INIT_CAMERA_EVENT_LOG': {
      return {
        ...state,
        ...(state.cameraEventLogs = []),
      }
    }
    case 'ADD_CAMERA_EVENT_LOG': {
      return {
        ...state,
        ...(state.cameraEventLogs = state.cameraEventLogs.concat(action.cameraEventLogs)),
      }
    }
    default:
  }
  return state
}

export function getSecurityEventsByCameraId(cameraId, dispatch, sortType = 'datetime', order = 0) {
  ;(INITIAL_STATE.sortType = sortType), (INITIAL_STATE.order = order)
  let url = rootReducer.serverUrl + '/api/securityEvents/eventLogsByCameraId'
  let url_1 = rootReducer.serverUrl + '/api/securityEvents/countByCameraId'
  axios
    .get(url_1, {
      params: {
        cameraId: cameraId,
      },
    })
    .then(response => {
      let total_count = response.data.count
      let limit = 1500
      let page_count =
        total_count % limit === 0 ? total_count / limit : Math.ceil(total_count / limit)
      getEventLogs(url, cameraId, 0, limit, page_count, sortType, order, dispatch)
    })
}

export function updateCameraEventLogs(cameraId, latest, callback) {
  let url = rootReducer.serverUrl + '/api/securityEvents/updateCameraEventLogs'
  axios
    .get(url, {
      params: {
        latest: latest,
        cameraId: cameraId,
      },
    })
    .then(response => {
      if (INITIAL_STATE.sortType !== 'datetime' || INITIAL_STATE.order !== 0) return
      let eventLogs = response.data
      callback(eventLogs)
    })
}

function getEventLogs(url, cameraId, index, limit, page_count, sortType, order, dispatch) {
  axios
    .get(url, {
      params: {
        limit: limit,
        cameraId: cameraId,
        offset: index * limit,
        sortType: sortType,
        order: order,
      },
    })
    .then(response => {
      let cameraEventLogs = response.data
      if (
        index === page_count ||
        sortType !== INITIAL_STATE.sortType ||
        order !== INITIAL_STATE.order
      ) {
        return
      } else {
        dispatch({
          type: 'ADD_CAMERA_EVENT_LOG',
          cameraEventLogs: cameraEventLogs,
        })
        index++
        getEventLogs(url, cameraId, index, limit, page_count, sortType, order, dispatch)
      }
    })
}
