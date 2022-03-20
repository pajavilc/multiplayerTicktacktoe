class GameSession {
    constructor() {
        this.grid = Array(9).fill(-1)
        this.playerIds = [null, null];
        this.playersWantToPlay = [true, true];
        this.score = [0, 0];
        this.playerTurn = 0;
        this.lastGameFirstPlayer = -1;
        this.turnNo = 0;
    }

    #winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    #checkForWin() {
        return this.#winningCombinations.some(combination => {
            return this.grid[combination[0]] === this.playerTurn && this.grid[combination[1]] === this.playerTurn && this.grid[combination[2]] === this.playerTurn;
        })
    }
    #checkUsernameIsPlayer(username) {
        if (username === this.playerIds[0]) return 0;
        if (username === this.playerIds[1]) return 1;
        return -1;
    }

    #toggleTurn() {
        if (this.playerTurn === -1) return;
        this.playerTurn = (this.playerTurn + 1) % 2;
        return;
    }

    #clearGrid() {
        this.grid = Array(9).fill(-1);
        return
    }

    #gameEnd(status) {
        let _grid = this.grid;
        let _playerTurn = this.playerTurn;
        this.#clearGrid();
        if (status !== 'tie') {
            this.score[this.playerTurn]++;
        }
        this.playerTurn = -1;
        this.playersWantToPlay = [false, false]
        return [status, _grid, _playerTurn, this.score];

    }




    #clearAll() {
        this.#clearGrid();
        this.score = [0, 0];
        this.playerTurn = -1;
        this.turnNo = 0;
        return;
    }


    #continueGame() {
        this.lastGameFirstPlayer = (this.lastGameFirstPlayer + 1) % 2;
        this.playerTurn = this.lastGameFirstPlayer;
        this.turnNo = 0;
        this.#clearGrid();
        return this.playerTurn;
    }
    /*
    0 full, 1 first pos, 2 second pos, 3 both
    */
    canJoin() {
        let res = 0;
        if (this.playerIds[0] == null) res += 1;
        if (this.playerIds[1] == null) res += 2;
        return res;
    }

    playerJoin(username) {
        let position = this.canJoin();
        if (position === 0) {
            return ['full', null];
        }
        if (position === 3) {
            position = Math.round(Math.random());
            this.playerIds[position] = username;
            return ['created', position, this.playerIds];
        }

        this.playerIds[position - 1] = username;
        return ['canStart', position - 1, this.playerIds];

    }

    playerDisconnect(username) {
        this.#clearAll();
        let index = this.playerIds.findIndex(name => name === username);
        if (index === -1) return false;
        this.playerIds[index] = null;
        this.lastGameFirstPlayer = -1;
        return true;
    }

    playerCycle(username, arrPos) {
        if (this.#checkUsernameIsPlayer(username) === -1) {
            return ['wrong player', 0];
        }
        if (this.playerTurn === -1) {
            return ['game hasn\'t started', 0];
        }
        this.grid[arrPos] = this.playerTurn;
        if (this.#checkForWin()) {
            return this.#gameEnd('win')
        }
        this.turnNo++;
        if (this.turnNo > 8) {
            return this.#gameEnd('tie');
        }
        this.#toggleTurn();
        return ['played', this.grid];
    }

    playerWantsToPlayToggle(username) {
        let playerPosition = this.#checkUsernameIsPlayer(username)
        if (playerPosition === -1) {
            return ['wrong player'];
        }
        this.playersWantToPlay[playerPosition] = true;
        if (this.playersWantToPlay[0] && this.playersWantToPlay[1]) {
            let _playerTurn = this.#continueGame()
            return ['start game', _playerTurn];
        }
        //other P id
        return ['toggled', (playerPosition + 1) % 2];
    }

    startGame() {
        if (this.lastGameFirstPlayer !== -1) throw 'cannot play'
        this.playerTurn = Math.round(Math.random());
        this.turnNo = 0;
        this.lastGameFirstPlayer = this.playerTurn;
        return this.playerTurn;
    }
    returnGrid() {
        return this.grid;
    }
    reconnect(username) {
        let index = this.playerIds.findIndex(name => name === username);
        this.playersWantToPlay[index] = true;
        let gamestarted = [false,]
        if (this.playersWantToPlay[0] && this.playersWantToPlay[1]) {
            let _playerTurn = this.#continueGame();
            gamestarted = [true, _playerTurn];
        }
        return { score: this.score, gamestarted: gamestarted, grid: this.grid, toggledPlay: this.playersWantToPlay, playerNames: this.playerIds, nowPlaying: this.playerTurn };
    }
}

module.exports = GameSession;