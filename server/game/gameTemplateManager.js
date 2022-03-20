require('dotenv').config();
const GameSession = require('./gameTemplate');

let maxNumberOfGames = parseInt(process.env.MAXNUMBEROFGAMES) || 12;
const GameInfos = Array(maxNumberOfGames);
const GameArr = Array(maxNumberOfGames);

function initializeGameMaster() {
    for (let i = 0; i < maxNumberOfGames; i++) {
        GameArr[i] = new GameSession()
        GameInfos[i] = {
            players: [null, null],
            score: [0, 0]
        };
    }
}

function joinGame(gameId, username) {
    let playerJoinStatus = GameArr[gameId].playerJoin(username)
    if (playerJoinStatus[0] === 'full') {
        return ['full', -1];
    }
    if (playerJoinStatus[0] === 'canStart') {
        const startingPlayer = GameArr[gameId].startGame();
        playerJoinStatus[0] = 'gameStarted';
        playerJoinStatus[playerJoinStatus.length] = startingPlayer;
    }
    GameInfos[gameId].players[playerJoinStatus[1]] = username;
    return playerJoinStatus;
}

function createGame(username) {
    for (let i = 0; i < maxNumberOfGames; i++) {
        if (GameArr[i].canJoin() === 3) {
            let x = joinGame(i, username)
            GameInfos[i].players[x[1]] = username;
            return [...x, i];
        }
    }
    return ['full']
}

function disconnectFromGame(gameId, username) {
    let x = GameArr[gameId].playerDisconnect(username);
    if (x === true) {
        let ind = GameInfos[gameId].players.indexOf(username);
        if (ind === -1) {
            throw ('err');
        }
        GameInfos[gameId].players[ind] = null;
        GameInfos[gameId].score = [0, 0];
    }
    return x;
}

function playerTurn(gameId, username, pick) {
    let res = GameArr[gameId].playerCycle(username, pick);
    if (res[0] !== 'played') {
        if (res[0] === 'win') {
            GameInfos[gameId].score = res[3];
        }
    }
    return res;
}
function playerWantsToTogglePlay(gameId, username) {
    let res = GameArr[gameId].playerWantsToPlayToggle(username);
    return res;
}

function returnInfos() {
    return GameInfos;
}
function returnInfo(gameId) {
    let x = [GameInfos[gameId]];
    x[1] = GameArr[gameId].returnGrid();
    return x;
}
function reconnect(gameID, username) {
    return GameArr[gameID].reconnect(username);
}


module.exports = { reconnect, returnInfo, playerWantsToTogglePlay, returnInfos, initializeGameMaster, joinGame, disconnectFromGame, playerTurn, maxNumberOfGames, createGame }