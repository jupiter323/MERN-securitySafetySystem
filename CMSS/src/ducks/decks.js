import axios from 'axios';
import rootReducer from './redux'

const INITIAL_STATE = { decksArray: [], currentDeck: {} };

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_DECKS':
        {
            return {...state, ...state.decksArray = action.decksArray};
        }
        case 'SET_CUR_DECK':
        {
            return {...state, ...state.currentDeck = action.currentDeck};
        }
        default:
    }
    return state;
}

export function getAllDecks( dispatch ) {
    let url = rootReducer.serverUrl + '/api/decks/all'
    axios.get(url).then( response => {
        let decks = response.data;
        dispatch({
            type: 'SET_DECKS',
            decksArray: decks
        })
    })
}

export function getDeckById( dispatch ) {
    let url = rootReducer.serverUrl + '/api/decks/id'
    axios.get(url, {
        params: {
            DeckNumber: 1
        }
    }).then( response => {
        console.log('responseDeck: ', response)
    })
}


