const INITIAL_STATE = {
  cameraViews: [],
  playbackView: {},
  deckView: {},
  sensorView: {},
  eventView: {},
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_PLAYBACK_VIEW': {
      return { ...state, ...(state.playbackView = action.playbackView) }
    }
    case 'SET_DECK_VIEW': {
      return { ...state, ...(state.deckView = action.deckView) }
    }
    case 'SET_SENSOR_VIEW': {
      return { ...state, ...(state.sensorView = action.sensorView) }
    }
    case 'SET_EVENT_VIEW': {
      return { ...state, ...(state.eventView = action.eventView) }
    }
    case 'SET_CAMERA_VIEWS': {
      return { ...state, ...(state.cameraViews = action.cameraViews) }
    }
    default:
  }
  return state
}
