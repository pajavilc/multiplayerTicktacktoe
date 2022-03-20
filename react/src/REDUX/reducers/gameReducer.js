const initialState = {
    status: 'notInGame',
    numberOfGames: -1,
    games: []
}
export default function gameReducer(state = initialState, action) {
    switch (action.type) {
        case 'games/loading': {
            return {
                ...state,
                games: {},
                status: 'loading'
            }
        }
        case 'games/loaded': {
            return {
                ...state,
                games: [...action.payload]
            }
        }

        default: {
            return {
                ...state
            }
        }
    }
}
