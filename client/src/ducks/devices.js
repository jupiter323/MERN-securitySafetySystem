import axios from 'axios'
import rootReducer from './redux'

const INITIAL_STATE = { devicesArray: [], deviceAttributeArray: [], currentCamera: {} }

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_DEVICES': {
      return { ...state, ...(state.devicesArray = action.devicesArray) }
    }
    case 'SET_CUR_CAMERA': {
      return { ...state, ...(state.currentCamera = action.currentCamera) }
    }
    case 'SET_DEVICE_ATTRIBUTE': {
      return { ...state, ...(state.deviceAttributeArray = action.deviceAttributeArray) }
    }
    default:
  }
  return state
}

export function getAllDevices(dispatch) {
  let url = rootReducer.serverUrl + '/api/devices/all'
  axios.get(url).then(response => {
    let devices = response.data
    dispatch({
      type: 'SET_DEVICES',
      devicesArray: devices,
    })
  })

  let url__1 = rootReducer.serverUrl + '/api/deviceAttributes/all'
  axios.get(url__1).then(response => {
    let deviceAttributes = response.data
    dispatch({
      type: 'SET_DEVICE_ATTRIBUTE',
      deviceAttributeArray: deviceAttributes,
    })
  })
}
