const selectMessages = (state) => state.chat.messages;
const selectChatStatus = (state) => state.chat.status;
const selectGameStatus = (state) => state.game.status;
const selectUsername = (state) => state.login.username;
const selectEndStatus = (state) => state.game.endStatus;
const selectGames = (state) => state.games.games;
const selectGameId = (state) => state.game.gameId;
const selectPlayers = (state) => state.game.playerNames;
const selectScore = (state) => state.game.score;
const selectNowPlaying = (state) => state.game.nowPlaying
const selectGrid = (state) => state.game.gameBoard;
const selectGameStats = (state) => state.game.gameStats;

export { selectGameStats, selectGameStatus, selectPlayers, selectScore, selectNowPlaying, selectGrid, selectMessages, selectChatStatus, selectUsername, selectEndStatus, selectGameId, selectGames }