const initialState = {
    status: 'IN_LOBBY',
    endStatus: {
        gameResult: null,
        lastPlayer: null
    },
    gameBoard: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    playerNames: [null, null],
    score: [0, 0],
    nowPlaying: null,
    gameId: null,
    gameStats: {
        wins: [],
        games: []
    }
}

export default function gameReducer(state = initialState, action) {
    switch (action.type) {
        case 'game/reset': {
            return {
                ...initialState
            }
        }
        case 'game/loadingGame': {
            return {
                ...state,
                status: 'loading'
            }
        }
        case 'game/spectateConnect': {
            return {
                ...state,
                status: 'spectator',
                playerNames: action.payload.playerNames,
                score: action.payload.score,
                gameBoard: action.payload.gameBoard
            }
        }
        case 'game/connect': {
            return {
                ...state,
                status: action.payload.status,
                playerNames: action.payload.playerNames,
                gameId: action.payload.gameId,
            }
        }
        case 'game/playerJoined': {
            return {
                ...state,
                playerNames: (action.payload.position === 0 ? [action.payload.username, state.playerNames[1]] : [state.playerNames[0], action.payload.username])
            }
        }
        case 'game/gameStarted': {
            return {
                ...state,
                status: state.status === 'spectator' ? 'spectator' : 'playing',
                nowPlaying: action.payload.startingPlayer
            }
        }
        case 'game/gameEnd': {
            return {
                ...state,
                status: state.status === 'spectator' ? 'spectator' : 'WAITING_FOR_CONTINUE',
                score: action.payload.score,
                endStatus: {
                    gameResult: action.payload.gameResult,
                    lastPlayer: action.payload.lastPlayer,
                    toggledPlay: [false, false]
                },
                gameBoard: action.payload.gameBoard
            }
        }
        case 'game/turnPlayed': {
            return {
                ...state,
                nowPlaying: (state.nowPlaying + 1) % 2,
                gameBoard: action.payload.gameBoard
            }
        }
        case 'game/playerToggledPlay': {
            let newStatus;
            let newToggledPlay;

            newToggledPlay = state.endStatus.toggledPlay;
            newToggledPlay[action.payload.waitingFor] = true;

            if (state.playerNames[action.payload.waitingFor] === action.payload.username) {
                newStatus = 'WAITING_FOR_CONTINUE';
            }
            else {
                newStatus = 'WAITING_FOR_PLAYER_TOGGLE'
            }

            return {
                ...state,
                status: state.status === 'spectator' ? 'spectator' : newStatus,
                endStatus: {
                    ...state.endStatus,
                    toggledPlay: newToggledPlay
                }
            }
        }
        case 'game/gameContinue': {
            return {
                ...state,
                status: state.status === 'spectator' ? 'spectator' : 'playing',
                endStatus: null,
                gameBoard: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
                nowPlaying: action.payload.nowPlaying
            }
        }
        case 'game/gameStatsLoaded': {
            return {
                ...state,
                gameStats: action.payload
            }
        }
        case 'game/playerLeft': {
            return {
                ...state,
                playerNames: action.payload.position === 0 ? [null, state.playerNames[1]] : [state.playerNames[0], null],
                status: state.status === 'spectator' ? 'spectator' : 'waiting',
                gameBoard: initialState.gameBoard,
                score: initialState.score,
                nowPlaying: initialState.nowPlaying
            }
        }
        case 'game/reconnect': {
            const toggledPlay = action.payload.toggledPlay;
            const status = (toggledPlay[0] && toggledPlay[1]) ? 'playing' : 'WAITING_FOR_PLAYER_TOGGLE';
            return {
                ...state,
                status: status,
                toggledPlay: toggledPlay,
                gameId: action.payload.gameId,
                position: action.payload.position,
                gameBoard: action.payload.grid,
                playerNames: action.payload.playerNames,
                nowPlaying: action.payload.nowPlaying,
                score: action.payload.score
            }

        }
        default: {
            return { ...state }
        }
    }


}