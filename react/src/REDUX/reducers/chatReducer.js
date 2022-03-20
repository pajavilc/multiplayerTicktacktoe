const initialState = {
    status: 'notInGame',
    messages: [
    ]
}
export default function chatReducer(state = initialState, action) {
    switch (action.type) {
        case 'chat/playerMessage': {
            return {
                ...state,
                messages: [
                    ...state.messages,
                    {
                        from: action.payload.from,
                        message: action.payload.message
                    }
                ]
            }
        }
        case 'chat/joinedGame': {
            return {
                ...state,
                status: 'inGame'
            }
        }
        case 'chat/reset': {
            return {
                ...initialState
            }
        }
        default: {
            return {
                ...state
            }
        }

    }

}