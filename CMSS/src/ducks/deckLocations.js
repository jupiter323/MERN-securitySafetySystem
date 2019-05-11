import axios from 'axios';
import rootReducer from './redux'

const INITIAL_STATE = { deckLocationArray: [] };

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_LOCATIONS':
        {
            return {...state, ...state.deckLocationArray = action.deckLocationArray};
        }
        default:
    }
    return state;
}

export function getAllDeckLocations( dispatch ) {
    let url = rootReducer.serverUrl + '/api/deckLocations/all'
    axios.get(url).then( response => {
        let locations = response.data;
        dispatch({
            type: 'SET_LOCATIONS',
            deckLocationArray: locations
        })
    })
}

