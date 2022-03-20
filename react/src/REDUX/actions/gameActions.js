import { GetAvailableGamesAPI } from "../../API/fetch";
import { reconnectProps, userLeaveProps, playerLeftProps, statsLoadedProps, spectatorJoinProps, gameContinueProps, playerToggledPlayProps, GameProps, ConnectProps, playerJoinedProps, startGameProps, turnPLayedProps, gameEndProps } from "./props"
import { joinedGame, playerLeave, userLeaveChat } from './chatActions'

const LoadGameData = () => dispatch => {
    GetAvailableGamesAPI().then((data) => {
        dispatch(GameProps(data));
    })
}

const CreatedGame = (data) => (dispatch, getState) => {

    const username = getState().login.username;
    const payload = {
        status: 'waiting',
        playerNames: (data.playerPosition === 0 ? [username, null] : [null, username]),
        gameId: data.gameId
    }
    dispatch(ConnectProps(payload));
    dispatch(joinedGame())
}

const userJoined = (data) => (dispatch, getState) => {
    const payload = {
        status: 'waiting',
        playerNames: data.playerNames,
        gameId: data.gameId,
    }
    dispatch(ConnectProps(payload))
    dispatch(joinedGame())
}

const gameStarted = (data) => dispatch => {
    const payload = {
        startingPlayer: data.startingPlayer
    }
    dispatch(startGameProps(payload))
}

const playerJoined = (data) => dispatch => {
    const payload = {
        username: data.username,
        position: data.position
    }
    dispatch(playerJoinedProps(payload))
}

const turnPLayed = (data) => dispatch => {
    const payload = {
        gameBoard: data.gameBoard
    }
    dispatch(turnPLayedProps(payload))
}

const gameEnd = (data) => dispatch => {
    try {
        const payload = {
            score: data.score,
            gameBoard: data.gameBoard,
            gameResult: data.gameResult,
            lastPlayer: data.lastPlayer
        }
        dispatch(gameEndProps(payload))
    }
    catch (err) {
        alert(err);
    }
}
const playerToggledPlay = (data) => (dispatch, getState) => {
    const username = getState().login.username;
    const payload = {
        waitingFor: data.waitingFor,
        username: username
    }
    dispatch(playerToggledPlayProps(payload));
}
const gameContinue = (data) => (dispatch) => {
    const payload = {
        nowPlaying: data.startingPlayer
    }
    dispatch(gameContinueProps(payload));
}
const spectatorJoin = (data) => (dispatch) => {
    const payload = {
        playerNames: data.gameInfo.players,
        score: data.gameInfo.score,
        gameBoard: data.gameInfo.gameBoard
    }
    dispatch(spectatorJoinProps(payload));
    dispatch(joinedGame())
}
const statsLoaded = (data) => (dispatch) => {
    const payload = {
        games: data.games,
        wins: data.wins
    }
    dispatch(statsLoadedProps(payload))
}
const playerLeft = (data) => (dispatch) => {
    const payload = {
        position: data.position,
    }
    dispatch(playerLeave(data))
    dispatch(playerLeftProps(payload))
}
const userLeave = () => (dispatch) => {
    dispatch(userLeaveProps())
    dispatch(userLeaveChat());
}
const reconnect = (data) => (dispatch, getState) => {
    const username = getState().login.username;
    const payload = {
        gameId: data.gameId,
        position: data.position,
        grid: data.grid,
        status: data.status,
        playerNames: data.playerNames,
        nowPlaying: data.nowPlaying,
        toggledPlay: data.toggledPlay,
        score: data.score,
        username: username
    }
    try {
        dispatch(reconnectProps(payload))
    }
    catch (err) {
        console.log(err);
        alert(err);
    }
    dispatch(joinedGame())
}
export { reconnect, userLeave, playerLeft, statsLoaded, spectatorJoin, gameContinue, LoadGameData, CreatedGame, playerJoined, userJoined, gameStarted, turnPLayed, gameEnd, playerToggledPlay };