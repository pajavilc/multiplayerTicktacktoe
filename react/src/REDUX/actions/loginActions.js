import { LogoutUserAPI } from '../../API/fetch'
import { userLeave } from './gameActions';
import { userLeaveChat } from './chatActions';

const LoginProps = (payload) => {
    return {
        type: 'login/login',
        payload: payload
    }
}
const LogoutProps = () => {
    return {
        type: 'login/logout',
        payload: null
    }
}

const LoginReduxAction = (data) => dispatch => {
    localStorage.setItem('accessToken', data.accessToken)
    dispatch(LoginProps(data.username))
}

const LogoutReduxAction = () => dispatch => {
    LogoutUserAPI().then(res => {
        localStorage.removeItem('accessToken');
        dispatch(LogoutProps());
        dispatch(userLeave());
        dispatch(userLeaveChat());
    }).catch((err) => alert(err))

}
export { LoginReduxAction, LogoutReduxAction }