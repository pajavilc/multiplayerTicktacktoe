const {
  returnInfos,
  playerWantsToTogglePlay,
  initializeGameMaster,
  joinGame,
  disconnectFromGame,
  playerTurn,
  maxNumberOfGames,
  returnStatus,
  createGame,
  returnInfo
} = require("./gameTemplateManager");
const {
  subscribers,
  ResponseIdEnum,
  sendPlayerToggled,
  sendGameContinue,
  makeResponse,
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
          ws.send(
            makeResponse(ResponseIdEnum.JOIN_STATUS, { status: "PLAYER_IN_OTHER_GAME" })
          );
          return;
        }
        const joinStatus = joinGame(response.data.gameId, ws.username);
        if (joinStatus[0] === "full") {
          ws.send(
            makeResponse(ResponseIdEnum.JOIN_STATUS, { status: "full", gameId: null })
          );
          return;
        }

        ws.gameId = response.data.gameId;
        ws.position = joinStatus[1];

        subscribers[ws.gameId][ws.position] = ws;

        ws.send(
          makeResponse(ResponseIdEnum.JOIN_STATUS, {
            status: "succesful",
            gameId: ws.gameId,
            playerPosition: ws.position,
            playerNames: joinStatus[2]
          })
        );
        sendPlayerJoined(ws.gameId, ws, ws.username, ws.position);
        sendPlayerData(ws);
        if (joinStatus[0] === 'gameStarted') sendGameStarted(ws.gameId, joinStatus[joinStatus.length - 1])
        return
      }
      case "PLAY": {
        const playStatus = playerTurn(ws.gameId, ws.username, response.data.pick);
        if (playStatus[0] === "wrong player") {
          ws.send(makeResponse(ResponseIdEnum.PLAY_STATUS, { status: "wrong player" }));
          return;
        }
        if (playStatus[0] === 'win' || playStatus[0] === 'tie') {
          if (playStatus[0] === 'win') {
            const winningPIndex = playStatus[2];
            PlayerGameSave(subscribers[ws.gameId][winningPIndex].id, subscribers[ws.gameId][(winningPIndex + 1) % 2].id).catch(err => {
              ws.send(makeResponse(ResponseIdEnum.DATABASE_ERROR), err);
              return;
            })
          }
          else {
            GameWasTieSave(subscribers[ws.gameId][0].id, subscribers[ws.gameId][1].id).catch(err => {
              ws.send(makeResponse(ResponseIdEnum.DATABASE_ERROR), err);
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
          ws.send(makeResponse(ResponseIdEnum.TOGGLE_PLAY_STATUS, {
            data: 'WRONG_PLAYER'
          }))
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
          ws.send(
            makeResponse(ResponseIdEnum.JOIN_SPECTATOR_STATUS, {
              status: ResponseIdEnum.PLAYER_IN_OTHER_GAME,
            })
          );
          return;
        }

        ws.gameId = response.data.gameId;
        if (ws.gameId > maxNumberOfGames - 1) {
          ws.send(makeResponse(ResponseIdEnum.JOIN_SPECTATOR_STATUS, "wrong gameID"));
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
          ws.send(
            makeResponse(ResponseIdEnum.DISCONNECT_STATUS, { status: "PLAYER_NOT_IN_GAME" })
          );
          return;
        }

        if (disconnectFromGame(ws.gameId, ws.username) === false) {
          ws.send(
            makeResponse(ResponseIdEnum.DISCONNECT_STATUS, {
              status: "PLAYER_CANNOT_DISCONNECT",
            })
          );
          return;
        }
        const pos = ws.position;
        const gameId = ws.gameId;
        subscribers[ws.gameId][pos] = null;
        ws.position = -1;
        ws.gameId = -1;

        ws.send(
          makeResponse(ResponseIdEnum.DISCONNECT_STATUS, { status: "PLAYER_DISCONNECTED" })
        );
        sendPlayerDisconnected(gameId, ws.username, pos);
        return;
      }

      case "DISCONNECT_SPECTATOR": {
        for (let i = 2; i < subscribers[ws.gameId].length; i++) {
          if (subscribers[ws.gameId][i] === ws) {
            subscribers[ws.gameId][i] = null;
            ws.send(
              makeResponse(ResponseIdEnum.DISCONNECT_SPECTATOR_STATUS, {
                status: "SPECTATOR_DISCONNECTED",
              })
            );
            sendSpectatorDisconnected(ws.gameId, ws, ws.username);
            return;
          }
        }

        ws.send(
          makeResponse(ResponseIdEnum.DISCONNECT_SPECTATOR_STATUS, { status: "failed" })
        );
        return;
      }

      case "CREATE_GAME": {
        if (ws.gameId !== -1) {
          ws.send(
            makeResponse(ResponseIdEnum.CREATE_GAME_STATUS, { status: "player_in_game" })
          );
          return;
        }

        const createStatus = createGame(ws.username);
        if (createStatus[0] === "full") {
          ws.send(
            makeResponse(ResponseIdEnum.CREATE_GAME_STATUS, { status: "server_full" })
          );
          return;
        }

        ws.gameId = createStatus[createStatus.length - 1];
        ws.position = createStatus[1];

        subscribers[ws.gameId][ws.position] = ws;
        ws.send(
          makeResponse(ResponseIdEnum.CREATE_GAME_STATUS, {
            status: "succesful",
            gameId: ws.gameId,
            playerPosition: ws.position,
          })
        );
        return;
      }

      case "SEND_CHAT_MESSAGE": {
        if (ws.gameId === -1) {
          ws.send(
            makeResponse(ResponseIdEnum.MESSAGGE_STATUS, { status: "PLAYER_NOT_IN_GAME" })
          );
          return;
        }

        const message = response.data.message;
        try {
          sendMessage(ws.gameId, ws.username, message)
        } catch (err) {
          ws.send(makeResponse(ResponseIdEnum.MESSAGGE_STATUS, "failed"));
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