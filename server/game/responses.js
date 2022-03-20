const { maxNumberOfGames } = require("../game/gameTemplateManager");
const { ReturnPlayersData } = require("../requests/database")
const subscribers = Array(maxNumberOfGames).fill(null).map(() => Array(2).fill(null));
//pseudo enum
const ResponseIdEnum = {
  AUTH_REQUIRED: "AUTH_REQUIRED",
  AUTH_FAILED: "AUTH_FAILED",
  JOIN_STATUS: "JOIN_STATUS",
  PLAY_STATUS: "PLAY_STATUS",
  TOGGLE_PLAY_STATUS: "TOGGLE_PLAY_STATUS",
  JOIN_SPECTATOR_STATUS: "JOIN_SPECTATOR_STATUS",
  DISCONNECT_STATUS: "DISCONNECT_STATUS",
  DISCONNECT_SPECTATOR_STATUS: "DISCONNECT_SPECTATOR_STATUS",
  CREATE_GAME_STATUS: "CREATE_GAME_STATUS",
  MESSAGGE_STATUS: "MESSAGGE_STATUS",
  PLAYED_TURN: "PLAYED_TURN",
  PLAYER_TOGGLED_PLAY: "PLAYER_TOGGLED_PLAY",
  GAME_STARTED: "GAME_STARTED",
  GAME_CONTINUE: "GAME_CONTINUE",
  PLAYER_JOINED: "PLAYER_JOINED",
  GAME_END: "GAME_END",
  SPECTATOR_JOINED: "SPECTATOR_JOINED",
  PLAYER_SENT_MESSAGE: "PLAYER_SENT_MESSAGE",
  PLAYER_DISCONNECTED: "PLAYER_DISCONNECTED",
  SPECTATOR_DISCONNECTED: "SPECTATOR_DISCONNECTED",
  STATS_LOADED: "STATS_LOADED",
  STATS_REQUEST_STATUS: "STATS_REQUEST_STATUS",
  DATABASE_ERROR: "DATABASE_ERROR",
  RECONNECT: "RECONNECT"
}
Object.freeze(ResponseIdEnum);
const RequestIDEnum = {

  JOIN_GAME: "JOIN_GAME",
  PLAY: "PLAY",
  TOGGLE_PLAY: "TOGGLE_PLAY",
  JOIN_SPECTATOR: "JOIN_SPECTATOR",
  DISCONNECT: "DISCONNECT",
  DISCONNECT_SPECTATOR: "DISCONNECT_SPECTATOR",
  CREATE_GAME: "CREATE_GAME",
  SEND_CHAT_MESSAGE: "SEND_CHAT_MESSAGE",
  AUTH: "AUTH"
}
Object.freeze(RequestIDEnum);
function makeResponse(responseID, data = '') {
  return JSON.stringify({ responseID: responseID, data: data });
}
function parseResponse(response) {
  return JSON.parse(response);
}
//#region Responses
function sendPlayerTurn(gameId, username, turnData) {
  const response = makeResponse(ResponseIdEnum.PLAYED_TURN, {
    username: username,
    gameBoard: turnData[1]
  });
  sendAll(gameId, response);
}
function sendPlayerToggled(gameId, indexOfYetNotAcceptedAccount) {
  const response = makeResponse(ResponseIdEnum.PLAYER_TOGGLED_PLAY, {
    waitingFor: indexOfYetNotAcceptedAccount
  })
  sendAll(gameId, response);
}

function sendGameStarted(gameId, startingPlayer) {
  const response = makeResponse(ResponseIdEnum.GAME_STARTED, {
    startingPlayer: startingPlayer
  })
  sendAll(gameId, response);
}

function sendGameContinue(gamedId, startingPlayer) {
  const response = makeResponse(ResponseIdEnum.GAME_CONTINUE, {
    startingPlayer: startingPlayer
  })
  sendAll(gamedId, response);
}

function sendPlayerJoined(gameId, ws, username, position) {
  const response = makeResponse(ResponseIdEnum.PLAYER_JOINED, {
    username: username,
    position: position,
  });
  sendAllExcept(gameId, ws, response);
}
function sendEndOfGame(gameId, status, grid, lastPlayer, score) {
  const response = makeResponse(ResponseIdEnum.GAME_END, {
    score: score,
    gameResult: status,
    gameBoard: grid,
    lastPlayer: lastPlayer
  })
  sendAll(gameId, response);
}
function sendSpectatorJoined(gameId, ws, username, gameInfo) {
  const data = {
    status: "succesful", gameInfo: {
      ...gameInfo[0],
      gameBoard: gameInfo[1]
    }
  }
  ws.send(makeResponse(ResponseIdEnum.JOIN_SPECTATOR_STATUS, data));
  const response = makeResponse(ResponseIdEnum.SPECTATOR_JOINED, { username: username });
  sendAllExcept(gameId, ws, response);
}

function sendMessage(gameId, username, message) {
  const response = makeResponse(ResponseIdEnum.PLAYER_SENT_MESSAGE, {
    username: username,
    message: message,
  });
  sendAll(gameId, response);
}

function sendPlayerDisconnected(gameId, username, position) {
  const response = makeResponse(ResponseIdEnum.PLAYER_DISCONNECTED, {
    username: username,
    position: position,
  });
  sendAll(gameId, response);
}

function sendSpectatorDisconnected(gameId, ws, username) {
  const response = makeResponse(ResponseIdEnum.SPECTATOR_DISCONNECTED, {
    username: username,
  });
  sendAll(gameId, response);
}
function sendStatus(status, data, ws) {
  ws.send(makeResponse(status, { ...data }))
}

async function sendPlayerData(ws) {
  const gameId = ws.gameId;
  const playerData = await ReturnPlayersData(subscribers[gameId][0].id || -1, subscribers[gameId][1].id || -1).catch(err => {
    ws.send(makeResponse(ResponseIdEnum.DATABASE_ERROR), err);
    return;
  })
  const response = makeResponse(ResponseIdEnum.STATS_LOADED, {
    wins: [playerData[0].winsTotal, playerData[1].winsTotal],
    games: [playerData[0].gamesTotal, playerData[1].gamesTotal]
  })
  subscribers[ws.gameId][0].send(response);
  subscribers[ws.gameId][1].send(response);
}
async function sendPlayerDataToSpectator(ws) {
  const gameId = ws.gameId;
  const playerData = await ReturnPlayersData(subscribers[gameId][0].id, subscribers[gameId][1].id).catch(err => {
    ws.send(makeResponse(ResponseIdEnum.DATABASE_ERROR), err);
    return;
  })
  ws.send(makeResponse(ResponseIdEnum.STATS_LOADED, {
    wins: [playerData[0].winsTotal, playerData[1].winsTotal],
    games: [playerData[0].gamesTotal, playerData[1].gamesTotal]
  }))
}

//#endregion
function sendAllExcept(gameId, ws, response) {
  let x = subscribers[gameId];
  for (let i = 0; i < subscribers[gameId].length; i++) {
    if (subscribers[gameId][i] === ws || subscribers[gameId][i] === null) {
      continue;
    }
    subscribers[gameId][i].send(response);
  }
}
function sendAll(gameId, response) {
  for (let i = 0; i < (subscribers[gameId].length); i++) {
    if (subscribers[gameId][i] === null) {
      continue;
    }
    subscribers[gameId][i].send(response);
  }
}




module.exports = {
  subscribers,
  RequestIDEnum,
  ResponseIdEnum,
  //------------------------------------------------
  makeResponse,
  parseResponse,
  sendPlayerDisconnected,
  sendPlayerJoined,
  sendPlayerTurn,
  sendSpectatorJoined,
  sendMessage,
  sendSpectatorDisconnected,
  sendGameStarted,
  sendEndOfGame,
  sendPlayerToggled,
  sendGameContinue,
  sendPlayerData,
  sendStatus,
  sendPlayerDataToSpectator
};
