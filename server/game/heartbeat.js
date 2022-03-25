
const subscribers = require("./responses");
const { sendPlayerDisconnected, sendSpectatorDisconnected } = require('./responses')
const { sendAuthRequired, sendDisconnectStatus } = require("../game/responses");
let interval;
let interval2;
let clients;
function startIntervals(_clients) {
    console.log('heartbeat interval started...');
    clients = _clients;
    interval = setInterval(() => {
        for (let j = 0; j < clients.length; j++) {
            const ws = clients[j];
            if (ws.isAlive === false) {
                const username = ws.username;
                const gameId = ws.gameId;
                const position = ws.position;
                try {
                    ws.terminate();
                }
                catch (err) {
                    console.log(err);
                    throw (err);
                    return
                }
                if (gameId === -1) return;
                if (position <= 2) {
                    disconnectFromGame(l, username) === false;
                    subscribers[j][position] = null;
                    ws.position = -1;
                    ws.gameId = -1;
                    sendDisconnectStatus(ws, "PLAYER_DISCONNECTED")
                    sendPlayerDisconnected(j, username, position);
                }
                else {
                    sendSpectatorDisconnected(j, username)
                }
                subscribers[gameId][position] = null;
                return
            }
            ws.isAlive = false;
            ws.ping();
            return
        }
    }, 30000)
    interval2 = setInterval(() => {
        for (let j = 0; j < clients.length; j++) {
            const ws = clients[j];
            ws.isAuth = false;
            sendAuthRequired(ws);
        }
    }, 30000)
}
function stopIntervals() {
    clearInterval(interval)
    clearInterval(interval2)
}

module.exports = { startIntervals, stopIntervals };