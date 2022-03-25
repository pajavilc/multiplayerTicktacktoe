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
  RECONNECT: "RECONNECT",
  PLAYER_LEFT_ERR: "PLAYER_LEFT_ERR"
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

function sendPlayerDisconnected(gameId, username, position, ws) {
  const response = makeResponse(ResponseIdEnum.PLAYER_DISCONNECTED, {
    username: username,
    position: position,
  });
  sendAllExcept(gameId, ws, response);
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
  if (subscribers[gameId][0] === null || subscribers[gameId][1] === null) {
    ws.send(makeResponse(ResponseIdEnum.PLAYER_LEFT_ERR, {}));
    return;
  }

  const playerData = await ReturnPlayersData(subscribers[gameId][0].id, subscribers[gameId][1].id).catch(err => {
    ws.send(makeResponse(ResponseIdEnum.DATABASE_ERROR), err);
    return;
  });

  const response = makeResponse(ResponseIdEnum.STATS_LOADED, {
    wins: [playerData[0].winsTotal, playerData[1].winsTotal],
    games: [playerData[0].gamesTotal, playerData[1].gamesTotal]
  });

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

async function sendPlayerInOtherGame(ws) {
  ws.send(
    makeResponse(ResponseIdEnum.JOIN_STATUS, { status: "PLAYER_IN_OTHER_GAME" })
  );
}
async function sendJointStatus(ws, status, gameId, playerPosition, playerNames) {
  ws.send(
    makeResponse(ResponseIdEnum.JOIN_STATUS, { status: status, gameId: gameId, playerPosition: playerPosition, playerNames: playerNames })
  );
}
async function sendJoinSpectatorStatus(ws, status) {
  ws.send(
    makeResponse(ResponseIdEnum.JOIN_SPECTATOR_STATUS, {
      status: status,
    })
  );
}
async function sendPlayStatus(ws, status) {
  ws.send(makeResponse(ResponseIdEnum.PLAY_STATUS, { status: status }));
}

async function sendDatabaseError(ws, err) {
  ws.send(makeResponse(ResponseIdEnum.DATABASE_ERROR), err);
}

async function sendTogglePlayStatus(ws) {
  ws.send(makeResponse(ResponseIdEnum.TOGGLE_PLAY_STATUS, {
    data: 'WRONG_PLAYER'
  }))
}
async function sendDisconnectSpectatorStatus(ws, status) {
  ws.send(
    makeResponse(ResponseIdEnum.DISCONNECT_STATUS, { status: status })
  );
}
async function sendDisconnectStatus(ws, status) {
  ws.send(
    makeResponse(ResponseIdEnum.DISCONNECT_SPECTATOR_STATUS, { status: status })
  );
}

async function sendCreateGameStatus(ws, status, gamedId, playerPosition) {
  ws.send(
    makeResponse(ResponseIdEnum.CREATE_GAME_STATUS, { status: status, gamedId: gamedId, playerPosition: playerPosition })
  );
}
async function sendAuthRequired(ws) {
  ws.send(makeResponse(ResponseIdEnum.AUTH_REQUIRED, {}));
}
async function sendReconnect(ws, gameId, position, grid, toggledPlay, playerNames, nowPlaying, score) {
  ws.send(makeResponse(ResponseIdEnum.RECONNECT, {
    gameId: gameId,
    position: position,
    grid: grid,
    toggledPlay: toggledPlay,
    playerNames: playerNames,
    nowPlaying: nowPlaying,
    score: score
  }))
}
async function sendMessageStatus(ws, status) {
  ws.send(
    makeResponse(ResponseIdEnum.MESSAGGE_STATUS, { status: status })
  );
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
  parseResponse,
  /*------------------------------------------------*/
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
  sendPlayerDataToSpectator,
  /*--------------------------------------------*/
  sendPlayerInOtherGame,
  sendJointStatus,
  sendJoinSpectatorStatus,
  sendPlayStatus,
  sendDatabaseError,
  sendTogglePlayStatus,
  sendDisconnectSpectatorStatus,
  sendDisconnectStatus,
  sendCreateGameStatus,
  sendMessageStatus,
  sendAuthRequired,
  sendReconnect
}