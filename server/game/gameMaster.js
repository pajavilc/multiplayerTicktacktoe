const {
  playerWantsToTogglePlay,
  initializeGameMaster,
  joinGame,
  disconnectFromGame,
  playerTurn,
  maxNumberOfGames,
  createGame,
  returnInfo
} = require("./gameTemplateManager");
const {
  subscribers,
  ResponseIdEnum,
  sendPlayerToggled,
  sendGameContinue,
  sendPlayerDisconnected,
  sendPlayerJoined,
  sendPlayerTurn,
  sendSpectatorJoined,
  sendMessage,
  sendSpectatorDisconnected,
  sendGameStarted,
  sendEndOfGame,
  sendPlayerData,
  sendPlayerDataToSpectator
} = require("./responses");
const {
  sendJointStatus,
  sendJoinSpectatorStatus,
  sendPlayStatus,
  sendDatabaseError,
  sendTogglePlayStatus,
  sendDisconnectSpectatorStatus,
  sendDisconnectStatus,
  sendCreateGameStatus,
  sendMessageStatus
} = require("./responses");
const {
  PlayerGameSave,
  GameWasTieSave
} = require('../requests/database')


initializeGameMaster();
console.log("game master initialized...");
function proccessWsMessage(ws, response) {
  {
    switch (response.requestID) {
      case "JOIN_GAME": {
        if (ws.gameId != -1) {
          sendJointStatus(ws, "PLAYER_IN_OTHER_GAME", -1, -1, [-1, -1]);
          return;
        }
        const joinStatus = joinGame(response.data.gameId, ws.username);
        if (joinStatus[0] === "full") {
          sendJointStatus(ws, "full", null, -1, [-1, -1]);
          return;
        }

        ws.gameId = response.data.gameId;
        ws.position = joinStatus[1];

        subscribers[ws.gameId][ws.position] = ws;

        sendJointStatus(ws, "succesful", ws.gameId, ws.position, joinStatus[2])
        sendPlayerJoined(ws.gameId, ws, ws.username, ws.position);
        sendPlayerData(ws);
        if (joinStatus[0] === 'gameStarted') sendGameStarted(ws.gameId, joinStatus[joinStatus.length - 1])
        return
      }
      case "PLAY": {
        const playStatus = playerTurn(ws.gameId, ws.username, response.data.pick);
        if (playStatus[0] === "wrong player") {
          sendPlayStatus(ws, "wrong player")
          return;
        }
        if (playStatus[0] === 'win' || playStatus[0] === 'tie') {
          if (playStatus[0] === 'win') {
            const winningPIndex = playStatus[2];
            PlayerGameSave(subscribers[ws.gameId][winningPIndex].id, subscribers[ws.gameId][(winningPIndex + 1) % 2].id).catch(err => {
              sendDatabaseError(ws, err);
              return;
            })
          }
          else {
            GameWasTieSave(subscribers[ws.gameId][0].id, subscribers[ws.gameId][1].id).catch(err => {
              sendDatabaseError(ws, err)
              return;
            })
          }
          sendEndOfGame(ws.gameId, playStatus[0], playStatus[1], playStatus[2], playStatus[3])
          return;
        }
        sendPlayerTurn(ws.gameId, ws.username, playStatus);
        return
      }
      case "TOGGLE_PLAY": {
        const toggleStatus = playerWantsToTogglePlay(ws.gameId, ws.username);
        if (toggleStatus[0] === 'wrong player') {
          sendTogglePlayStatus(ws);
          return;
        }
        if (toggleStatus[0] === 'start game') {
          sendGameContinue(ws.gameId, toggleStatus[1]);
        }
        sendPlayerToggled(ws.gameId, toggleStatus[1])
        return;
      }
      case "JOIN_SPECTATOR": {
        if (ws.gameId != -1) {
          sendJoinSpectatorStatus(ws, ResponseIdEnum.PLAYER_IN_OTHER_GAME);
          return;
        }

        ws.gameId = response.data.gameId;
        if (ws.gameId > maxNumberOfGames - 1) {
          sendJoinSpectatorStatus(ws, "wrong gameID")
          return;
        }
        ws.position = -1;
        for (let i = 2; i < subscribers[ws.gameId].length; i++) {
          if (subscribers[ws.gameId][i] == null) {
            ws.position = i;
            i = subscribers[gameId].length;
          }
        }
        if (ws.position === -1) {
          ws.position = subscribers[ws.gameId].length;
        }
        subscribers[ws.gameId][ws.position] = ws;
        const gameInfo = returnInfo(ws.gameId);
        sendSpectatorJoined(ws.gameId, ws, ws.username, gameInfo);
        sendPlayerDataToSpectator(ws);
        return
      }

      case "DISCONNECT": {
        if (ws.gameId === -1) {
          sendDisconnectStatus(ws, "PLAYER_NOT_IN_GAME")
          return;
        }

        if (disconnectFromGame(ws.gameId, ws.username) === false) {
          sendDisconnectStatus(ws, "PLAYER_CANNOT_DISCONNECT")
          return;
        }
        const pos = ws.position;
        const gameId = ws.gameId;
        subscribers[ws.gameId][pos] = null;
        ws.position = -1;
        ws.gameId = -1;

        sendDisconnectStatus(ws, "PLAYER_DISCONNECTED")
        sendPlayerDisconnected(gameId, ws.username, pos, ws);
        return;
      }

      case "DISCONNECT_SPECTATOR": {
        for (let i = 2; i < subscribers[ws.gameId].length; i++) {
          if (subscribers[ws.gameId][i] === ws) {
            subscribers[ws.gameId][i] = null;
            sendDisconnectSpectatorStatus(ws, "SPECTATOR_DISCONNECTED")
            sendSpectatorDisconnected(ws.gameId, ws, ws.username);
            return;
          }
        }

        sendDisconnectSpectatorStatus(ws, "failed")
        return;
      }

      case "CREATE_GAME": {
        if (ws.gameId !== -1) {
          sendCreateGameStatus(ws, "player_in_game", -1, -1)
          return;
        }

        const createStatus = createGame(ws.username);
        if (createStatus[0] === "full") {
          sendCreateGameStatus(ws, "server_full")
          return;
        }

        ws.gameId = createStatus[createStatus.length - 1];
        ws.position = createStatus[1];

        subscribers[ws.gameId][ws.position] = ws;
        sendCreateGameStatus(ws, "succesful", ws.gameId, ws.position);
        return;
      }

      case "SEND_CHAT_MESSAGE": {
        if (ws.gameId === -1) {
          sendMessageStatus(ws, "PLAYER_NOT_IN_GAME");
          return;
        }

        const message = response.data.message;
        try {
          sendMessage(ws.gameId, ws.username, message)
        } catch (err) {
          sendMessageStatus(ws, "failed")
          return;
        }
        return;
      }
      default: {
        return;
      }
    }
  }
}

module.exports = { proccessWsMessage };