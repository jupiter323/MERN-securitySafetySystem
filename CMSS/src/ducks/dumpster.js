const INITIAL_STATE = { dumpsters: {}, cur_dumpster: 0 };

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET':
            { state.dumpsters = action.dumpsters }
        case 'CUR_DUMPSTER':
            { state.cur_dumpster = action.dumpster}
        default:
    }
    return state;
}