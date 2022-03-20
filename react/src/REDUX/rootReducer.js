import { combineReducers } from 'redux';
import loginReducer from './reducers/loginReducer';
import gameReducer from './reducers/gameReducer';
import normalGameReducer from './reducers/normalGameReducer';
import chatReducer from './reducers/chatReducer';


const rootReducer = combineReducers({
    login: loginReducer,
    games: gameReducer,
    chat: chatReducer,
    game: normalGameReducer
})

export default rootReducer;