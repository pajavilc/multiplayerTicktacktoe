
const playerMessageProps = (payload) => {
    return {
        type: 'chat/playerMessage',
        payload: payload
    }
}
const joinedGameProps = (payload) => {
    return {
        type: 'chat/joinedGame',
        payload: payload
    }
}
const userLeaveChatProps = (payload) => {
    return {
        type: 'chat/reset'
    }
}

const playerMessage = (data) => (dispatch) => {
    const payload = {
        from: data.username,
        message: data.message
    }
    dispatch(playerMessageProps(payload));
}
const joinedGame = () => (dispatch) => {
    dispatch(joinedGameProps());
}
const spectatorLeave = (data) => (dispatch) => {
    const payload = {
        from: 'SYSTEM',
        message: `spectator ${data.username} left`
    }
    dispatch(playerMessageProps(payload));
}
const playerLeave = (data) => (dispatch) => {
    const payload = {
        from: 'SYSTEM',
        message: `player ${data.username} left`
    }
    dispatch(playerMessageProps(payload));
}
const userLeaveChat = () => (dispatch) => {
    dispatch(userLeaveChatProps());
}
export { userLeaveChat, playerMessage, joinedGame, spectatorLeave, playerLeave }
