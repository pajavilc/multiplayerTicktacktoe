import { reconnect, userLeave, playerLeft, statsLoaded, spectatorJoin, gameContinue, playerToggledPlay, CreatedGame, playerJoined, userJoined, gameStarted, turnPLayed, gameEnd } from "../REDUX/actions/gameActions";
import { playerMessage, spectatorLeave } from "../REDUX/actions/chatActions";
import { ResponseIdEnum, RequestIDEnum } from "./responses";

function onMessageParse(ws, event, dispatch) {
    const response = parseResponse(event);
    switch (response.responseID) {
        case RequestIDEnum.AUTH_REQUIRED: {
            const token = localStorage.getItem('accessToken');
            ws.send(makeResponse(ResponseIdEnum.AUTH, { bearer: token }))
            return;
        }
        case RequestIDEnum.CREATE_GAME_STATUS: {
            dispatch(CreatedGame(response.data));
            return;
        }
        case RequestIDEnum.JOIN_STATUS: {
            if (response.data.status === 'full') return alert('full')
            if (response.data.status === 'PLAYER_IN_OTHER_GAME') return alert('ERROR: PLAYER_IN_OTHER_GAME')
            dispatch(userJoined(response.data));
            return;
        }
        case RequestIDEnum.JOIN_SPECTATOR_STATUS: {
            if (response.data.status !== 'succesful') return alert('error')
            dispatch(spectatorJoin(response.data))
            return
        }
        case RequestIDEnum.PLAYER_JOINED: {
            dispatch(playerJoined(response.data));
            return;
        }
        case RequestIDEnum.SPECTATOR_JOINED: {
            return;
        }
        case RequestIDEnum.GAME_STARTED: {
            dispatch(gameStarted(response.data))
            return;
        }
        case RequestIDEnum.PLAYED_TURN: {
            dispatch(turnPLayed(response.data));
            return;
        }
        /*------------------------------------------------------------------- */
        case RequestIDEnum.PLAY_STATUS: {
            alert('ERROR');
            return;
        }
        case RequestIDEnum.GAME_END: {
            dispatch(gameEnd(response.data))
            return;
        }
        case RequestIDEnum.PLAYER_TOGGLED_PLAY: {
            dispatch(playerToggledPlay(response.data));
            return;
        }
        case RequestIDEnum.GAME_CONTINUE: {
            dispatch(gameContinue(response.data));
            return;
        }
        case RequestIDEnum.MESSAGGE_STATUS: {
            if (response.data.status === 'failed') {
                alert('failed to send message');

            }
            return;
        }
        case RequestIDEnum.PLAYER_SENT_MESSAGE: {
            dispatch(playerMessage(response.data));
            return;
        }
        case RequestIDEnum.STATS_LOADED: {
            dispatch(statsLoaded(response.data))
            return;
        }
        case RequestIDEnum.PLAYER_DISCONNECTED: {
            dispatch(playerLeft(response.data));
            return;
        }
        case RequestIDEnum.SPECTATOR_DISCONNECTED: {
            dispatch(spectatorLeave(response.data));
            return;
        }
        case RequestIDEnum.DISCONNECT_STATUS: {
            if (response.data.status !== "PLAYER_DISCONNECTED") {
                alert(`Error ${response.data.status}`);
                return
            }
            dispatch(userLeave())
            return;
        }
        case RequestIDEnum.DISCONNECT_SPECTATOR_STATUS: {
            if (response.data.status !== "SPECTATOR_DISCONNECTED") {
                alert(`Error ${response.data.status}`);
                return
            }
            dispatch(userLeave())
            return
        }
        case RequestIDEnum.RECONNECT: {
            dispatch(reconnect(response.data));

            return
        }



        default: {
            return;
        }
    }
}

function makeResponse(requestID, data) {
    return JSON.stringify({ requestID: requestID, data: data });
}
function parseResponse(response) {
    return JSON.parse(response.data);
}
export { makeResponse, parseResponse };
export default onMessageParse;