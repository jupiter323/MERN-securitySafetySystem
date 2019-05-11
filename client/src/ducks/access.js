const INITIAL_STATE = {
  enabled: false,
  location: {
    room: '',
    deck: '',
  },
  clearance: 0,
  cameraId: '',
  cameraImage: '',
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'CLEAR_ACCESS': {
      return { ...state, ...(state = action.accessInfo) }
    }
    case 'SET_ACCESS': {
      return { ...state, ...(state = action.accessInfo) }
    }
    case 'SET_IMAGE': {
      return { ...state, ...(state.cameraImage = action.cameraImage) }
    }
    default:
  }
  return state
}
