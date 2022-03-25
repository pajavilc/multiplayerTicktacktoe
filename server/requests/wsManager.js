const express = require("express");
const router = new express.Router();
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const { proccessWsMessage } = require('../game/gameMaster')
const { startIntervals, stopIntervals, show } = require('../game/heartbeat')
const { sendAuthRequired, sendReconnect, parseResponse, sendGameContinue } = require("../game/responses");
const { returnInfos, reconnect } = require("../game/gameTemplateManager");
const { subscribers, RequestIDEnum } = require('../game/responses');
const { startClearIntervals, stopClearIntervals } = require('../game/clearIntervals');
const mapUserToWebSocket = new Map();
wss = new WebSocket.Server({ noServer: true });


startIntervals(wss.clients);
startClearIntervals();
console.log("websocket server started...");


wss.on("connection", (ws, request) => {
  ws.isAuth = true;
  sendAuthRequired(ws);
  ws.binaryType = "arraybuffer";
  ws.username;
  ws.position = -1;
  ws.gameId = -1;
  ws.isAlive = true;

  ws.on("pong", setAlive);

  ws.on("message", (message) => {

    const response = parseResponse(message);
    if (response.requestID === RequestIDEnum.AUTH) {
      const x = authenticateUseUpgrade(response.data.bearer);
      if (x === false) {
        sendAuthRequired(ws);
        return;
      }
      ws.username = x.username;
      checkForDuplicateConnection(mapUserToWebSocket, ws)
      ws.id = x.id;
      ws.isAuth = true;
      return;
    }

    if (ws.isAuth === false) {
      sendAuthRequired(ws);
      return;
    }

    proccessWsMessage(ws, response);
  });

  ws.on("close", () => {
    if (ws.gameId === -1) {
      return;
    }
    for (let i = 0; i < subscribers[ws.gameId].length; i++) {
      if (subscribers[ws.gameId][i] != ws.username) continue;
      if (i <= 2) {
        sendPlayerDisconnected(ws.gameId, ws, ws.username);
      }
      sendSpectatorDisconnected(ws.gameId, ws, ws.username, ws.position);
      return;
    }
  });

  ws.on("terminate", () => {
  });
});

function setAlive() {
  this.isAlive = true;
}

function authenticateUseUpgrade(bearer) {
  if (bearer == undefined || bearer == null) {
    return false;
  }
  return jwt.verify(bearer, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
    if (err) return false;
    return user;
  });
}

function checkForDuplicateConnection(map, ws) {
  if (map.get(ws.username) !== undefined) {
    const _ws = map.get(ws.username);
    const username = _ws.username;
    const position = _ws.position;
    const gameId = _ws.gameId;
    try {
      map.get(ws.username).terminate();
    }
    catch (err) {
      console.log(err);
      throw (err);
      return
    }
    ws.username = username;
    ws.position = position;
    ws.gameId = gameId;
    if (gameId !== -1) {
      if (position <= 2) {
        subscribers[gameId][position] = ws;
        const { gamestarted, grid, toggledPlay, playerNames, nowPlaying, score } = reconnect(gameId, username);
        if (gamestarted[0]) {
          sendGameContinue(gameId, gamestarted[1]);
        }
        sendReconnect(ws, gameId, position, grid, toggledPlay, playerNames, nowPlaying, score)
      }
      else {
        for (let i = 2; i < subscribers[gameId].length; i++) {
          if (subscribers[gameId][i] == null) {
            ws.position = i;
            i = subscribers[gameId].length;
          }
        }
        if (ws.position === -1) {
          ws.position = subscribers[ws.gameId].length;
        }
        sendSpectatorDisconnected(gameId, ws, username)
      }
    }
  }
  map.set(ws.username, ws);
}

router.get("/games", (req, res) => {
  try {
    res.status(201);
    res.write(JSON.stringify(returnInfos()));
    res.send();
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});


module.exports = router;