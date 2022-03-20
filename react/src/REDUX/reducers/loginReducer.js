/*  idle: default
    loading,
    error
*/
const initialState = {
    status: 'idle',
    username: null

}
export default function loginReducer(state = initialState, action) {
    switch (action.type) {
        case 'login/loading': {
            return {
                ...state,
                status: 'loading'
            }

        }
        case 'login/logout': {
            return {
                ...state,
                status: 'idle',
                username: null
            }
        }
        case 'login/login': {
            return {
                ...state,
                status: 'idle',
                username: action.payload
            }
        }

        default: {
            return {
                ...state
            }
        }
    }

}