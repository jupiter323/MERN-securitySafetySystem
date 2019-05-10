import axios from 'axios';
import rootReducer from './redux'

const INITIAL_STATE = { deckZones: [] };

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_DECK_ZONES':
        {
            return {...state, ...state.deckZones = action.deckZones};
        }
        default:
    }
    return state;
}

export function getAllDeckZones( dispatch ) {
    let url = rootReducer.serverUrl + '/api/deckZones/all'
    axios.get(url).then( response => {
        let deckZones = response.data;
        dispatch({
            type: 'SET_DECK_ZONES',
            deckZones: deckZones
        });
    })
}
