import { combineReducers } from 'redux';
import loginReducer from './reducers/loginReducer';
import gameReducer from './reducers/gameReducer';
import gameLobbyReducer from './reducers/gameLobbyReducer';
import chatReducer from './reducers/chatReducer';


const rootReducer = combineReducers({
    login: loginReducer,
    game: gameReducer,
    chat: chatReducer,
    games: gameLobbyReducer
})

export default rootReducer;