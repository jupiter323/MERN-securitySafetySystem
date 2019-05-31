const INITIAL_STATE = {
    numberkeypassed: false,
    buttonsmode: [],
    code: null,
    acknowledgedAlarm: false,
    alarmMessages: []
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_Number_Key_passed': {
            return { ...state, ...(state.numberkeypassed = action.numberkeypassed) }
        }
        case 'SET_Number_Key_button_mode': {
            return { ...state, ...(state.buttonsmode = action.buttonsmode) }
        }
        case 'SET_Number_Key': {
            return { ...state, ...(state.code = action.code) }
        }
        case 'SET_Number_Key_acknowledged_alarm': {
            return { ...state, ...(state.acknowledgedAlarm = action.acknowledgedAlarm) }
        }
        case 'ADD_Alarm_message': {
            return { ...state, ...(state.alarmMessages.push(action.alarmMessage)) }
        }

        default:
    }
    return state
}
