import axios from 'axios'
import rootReducer from './redux'

const INITIAL_STATE = { display: true, sortType: 'datetime', order: 0, eventLogs: [] }

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'INIT_EVENT_LOG': {
      return {
        ...state,
        ...(state.eventLogs = []),
      }
    }
    case 'ADD_EVENT_LOG': {
      return {
        ...state,
        ...(state.eventLogs = state.eventLogs.concat(action.eventLogs)),
      }
    }
    default:
  }
  return state
}

export function getAllSecurityEvents(dispatch, sortType = 'datetime', order = 0) {
  ;(INITIAL_STATE.sortType = sortType), (INITIAL_STATE.order = order)
  let url = rootReducer.serverUrl + '/api/securityEvents/allEventLogs'
  let url1 = rootReducer.serverUrl + '/api/securityEvents/count'
  axios.get(url1).then(response => {
    let total_count = response.data.count
    let limit = 1500
    let page_count =
      total_count % limit === 0 ? total_count / limit : Math.ceil(total_count / limit)
    getEventLogs(url, 0, limit, page_count, sortType, order, dispatch)
  })
}

export function updateEventLogs(latest, callback) {
  let url = rootReducer.serverUrl + '/api/securityEvents/updateEventLogs'
  axios
    .get(url, {
      params: {
        latest: latest,
      },
    })
    .then(response => {
      if (INITIAL_STATE.sortType !== 'datetime' || INITIAL_STATE.order !== 0) return
      let eventLogs = response.data
      callback(eventLogs)
    })
}

function getEventLogs(url, index, limit, page_count, sortType, order, dispatch) {
  axios
    .get(url, {
      params: {
        limit: limit,
        offset: index * limit,
        sortType: sortType,
        order: order,
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
        dispatch({
          type: 'ADD_EVENT_LOG',
          eventLogs: eventLogs,
        })
        index++
        getEventLogs(url, index, limit, page_count, sortType, order, dispatch)
      }
    })
}
