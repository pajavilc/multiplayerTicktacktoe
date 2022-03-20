
const GameProps = (payload) => {
    return {
        type: 'games/loaded',
        payload: payload
    }
}
const ConnectProps = (payload) => {
    return {
        type: 'game/connect',
        payload: payload
    }
}
const playerJoinedProps = (payload) => {
    return {
        type: 'game/playerJoined',
        payload: payload
    }
}
const startGameProps = (payload) => {
    return {
        type: 'game/gameStarted',
        payload: payload
    }
}
const turnPLayedProps = (payload) => {
    return {
        type: 'game/turnPlayed',
        payload: payload
    }
}
const gameEndProps = (payload) => {
    return {
        type: 'game/gameEnd',
        payload: payload
    }
}
const playerToggledPlayProps = (payload) => {
    return {
        type: 'game/playerToggledPlay',
        payload: payload
    }
}
const gameContinueProps = (payload) => {
    return {
        type: 'game/gameContinue',
        payload: payload
    }
}
const spectatorJoinProps = (payload) => {
    return {
        type: 'game/spectateConnect',
        payload: payload
    }
}
const statsLoadedProps = (payload) => {
    return {
        type: 'game/gameStatsLoaded',
        payload: payload
    }
}
const playerLeftProps = (payload) => {
    return {
        type: 'game/playerLeft',
        payload: payload
    }
}
const userLeaveProps = (payload) => {
    return {
        type: 'game/reset',
        payload: payload
    }

}
const reconnectProps = (payload) => {
    return {
        type: 'game/reconnect',
        payload: payload
    }
}

export { reconnectProps, userLeaveProps, playerLeftProps, statsLoadedProps, spectatorJoinProps, gameContinueProps, playerToggledPlayProps, GameProps, ConnectProps, playerJoinedProps, startGameProps, turnPLayedProps, gameEndProps }