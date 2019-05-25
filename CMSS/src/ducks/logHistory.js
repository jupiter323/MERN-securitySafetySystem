import rootReducer from './redux'
import axios from 'axios'
import { store } from '../index.js';
const INITIAL_STATE = {
  logHistory: [],
  deviceAttributeArray: [],
  sortType: 'datetime',
  order: 0,
  accessInfo: {
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
  },
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'PUSH_DATA': {
      console.log('LogHistory: ', state.logHistory)
      return { ...state, ...(state.logHistory = state.logHistory.concat(action.data)) }
    }
    case 'CLEAR_DATA': {
      console.log('clear data')
      return { ...state, ...(state.logHistory = []), ...(state.accessInfo = action.accessInfo) }
    }
    case 'INIT_DEVICE_EVENT_LOG': {
      return {
        ...state,
        ...(state.logHistory = []),
      }
    }
    case 'SET_ACCESS': {
      return { ...state, ...(state.accessInfo = action.accessInfo) }
    }
    case 'SET_IMAGE': {
      return { ...state, ...(state.cameraImage = action.cameraImage) }
    }
    case 'SET_DEVICE_ATTRIBUTES': {
      return { ...state, ...(state.deviceAttributeArray = action.deviceAttributeArray) }
    }
    default:
  }
  return state
}

export let getSecurityEventsByDeviceID = (
  accessInfo,
  dispatch,
  sortType = 'datetime',
  order = 0,
) => {
  ; (INITIAL_STATE.sortType = sortType), (INITIAL_STATE.order = order)
  let deviceId = accessInfo.DeviceID
  let url = rootReducer.serverUrl + '/api/securityEvents/getEventsByDeviceId'
  let url_1 = rootReducer.serverUrl + '/api/securityEvents/getCountByDeviceId?'
  axios
    .get(url_1, {
      params: {
        DeviceID: deviceId,
      },
    })
    .then(response => {
      let total_count = response.data.count
      console.log('eventLog count: ', total_count)
      let limit = 300
      let page_count =
        total_count % limit === 0 ? total_count / limit : Math.ceil(total_count / limit)
      getEventsByDeviceId(url, 0, limit, page_count, sortType, order, deviceId, dispatch)
    })
}

function getEventsByDeviceId(url, index, limit, page_count, sortType, order, deviceId, dispatch) {
  axios
    .get(url, {
      params: {
        limit: limit,
        offset: index * limit,
        sortType: sortType,
        order: order,
        DeviceID: deviceId,
      },
    })
    .then(response => {
      let eventLogs = response.data
      if (
        index === page_count ||
        sortType !== INITIAL_STATE.sortType ||
        order !== INITIAL_STATE.order
      ) {
        return
      } else {
        let logArray = []
        eventLogs.forEach(log => {
          let datetime = log.DateTime
          let datetime_string = new Date(datetime)
            .toLocaleString('en-GB', { timeZone: 'UTC' })
            .replace(',', '')
          let date = datetime_string.split(' ')[0]
          let time = datetime_string.split(' ')[1]
          let temp_array = log.EventMsg.split(' ')
          let access =
            temp_array.length > 1 ? temp_array[1].toUpperCase() : temp_array[0].toUpperCase()
          let operator = log.EventAttribute.AttributeValueString
          let memberId = log.EventAttribute.UserPassword.UserID
          let clearanceId = log.EventAttribute.UserPassword.UserSecurityClearance_ClearanceID
          logArray.push({
            datetime: datetime,
            date: date,
            time: time,
            access: access,
            operator: operator,
            memberId: memberId,
            clearanceId: clearanceId,
          })
        })
        dispatch({
          type: 'PUSH_DATA',
          data: logArray,
        })
        index++
        var enabled = store.getState().logInfo.accessInfo.enabled
        if (enabled)
          getEventsByDeviceId(url, index, limit, page_count, sortType, order, deviceId, dispatch)
      }
    })
}

let getUserByUsername = (username, callback) => {
  let url = rootReducer.serverUrl + '/api/Users?username=' + username
  axios.get(url).then(response => {
    let user = response.data
    callback(user)
  })
}

export let getCameraInfoByDeviceId = (deviceId, callback) => {
  let url = rootReducer.serverUrl + '/api/DeviceAttributes?SecurityDeviceID=' + deviceId
  axios.get(url).then(response => {
    callback(response.data)
  })
}

export let getAllDeviceAttributes = dispatch => {
  let url = rootReducer.serverUrl + '/api/DeviceAttributes/all'
  axios.get(url).then(response => {
    let deviceAttributes = response.data
    dispatch({
      type: 'SET_DEVICE_ATTRIBUTES',
      deviceAttributeArray: deviceAttributes,
    })
  })
}
