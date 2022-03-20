import { useContext } from "react";
import { useSelector } from "react-redux";
import { WebSocketContext } from "../../prefabs/websocket";
import '../../../styles/GamePlay.css';
import { makeResponse } from '../../../API/ws';
import { ResponseIdEnum } from "../../../API/responses";
import ContinuePoppup from "./ContinuePoppup";
import { selectUsername, selectGameStatus, selectPlayers, selectScore, selectNowPlaying, selectGrid } from "../../../REDUX/selectors/selectors";


function GamePlay() {
  const status = useSelector(selectGameStatus);
  const players = useSelector(selectPlayers);
  const nowPlaying = useSelector(selectNowPlaying);
  const score = useSelector(selectScore);
  const grid = useSelector(selectGrid);
  const username = useSelector(selectUsername);
  const isPlayerOnTurn = ((username === players[nowPlaying] && status === 'playing'));
  const ws = useContext(WebSocketContext);

  function sendPlay(id) {
    if (!isPlayerOnTurn || grid[id] !== -1) return;
    ws.send(makeResponse(ResponseIdEnum.PLAY, { pick: id }));
    return
  }
  function sendToggle() {
    ws.send(makeResponse(ResponseIdEnum.TOGGLE_PLAY));
  }
  function sendExit() {
    ws.send(makeResponse(ResponseIdEnum.DISCONNECT))
  }

  return <>
    {status === 'WAITING_FOR_CONTINUE' && <ContinuePoppup score={score} sendToggle={sendToggle} sendExit={sendExit} players={players}></ContinuePoppup>}
    <div className="gameField">
      <div className="score">
        <p className={nowPlaying === 0 ? 'highlight' : ''}>{players[0]}</p>
        <p>{score[0]}&nbsp; : &nbsp;{score[1]}</p>
        <p className={nowPlaying === 1 ? 'highlight' : ''}>{players[1]}</p>
      </div>
      <div className={`showText ${status === 'WAITING_FOR_PLAYER_TOGGLE' ? '' : 'hidden'}`}>Waiting for {players[0] === username ? players[1] : players[0]} to toggle play</div>
      <div className="game">
        <div className="table">
          <div className={`td ${(grid[0] === -1 && isPlayerOnTurn) ? 'active' : ''}`} onClick={() => { sendPlay(0) }}>{(grid[0] === 0 ? 'X' : grid[0] === 1 ? 'O' : '')}</div>
          <div className={`td ${(grid[1] === -1 && isPlayerOnTurn) ? 'active' : ''}`} onClick={() => { sendPlay(1) }}>{(grid[1] === 0 ? 'X' : grid[1] === 1 ? 'O' : '')}</div>
          <div className={`td ${(grid[2] === -1 && isPlayerOnTurn) ? 'active' : ''}`} onClick={() => { sendPlay(2) }}>{(grid[2] === 0 ? 'X' : grid[2] === 1 ? 'O' : '')}</div>

          <div className={`td ${(grid[3] === -1 && isPlayerOnTurn) ? 'active' : ''}`} onClick={() => { sendPlay(3) }}>{(grid[3] === 0 ? 'X' : grid[3] === 1 ? 'O' : '')}</div>
          <div className={`td ${(grid[4] === -1 && isPlayerOnTurn) ? 'active' : ''}`} onClick={() => { sendPlay(4) }}>{(grid[4] === 0 ? 'X' : grid[4] === 1 ? 'O' : '')}</div>
          <div className={`td ${(grid[5] === -1 && isPlayerOnTurn) ? 'active' : ''}`} onClick={() => { sendPlay(5) }}>{(grid[5] === 0 ? 'X' : grid[5] === 1 ? 'O' : '')}</div>

          <div className={`td ${(grid[6] === -1 && isPlayerOnTurn) ? 'active' : ''}`} onClick={() => { sendPlay(6) }}>{(grid[6] === 0 ? 'X' : grid[6] === 1 ? 'O' : '')}</div>
          <div className={`td ${(grid[7] === -1 && isPlayerOnTurn) ? 'active' : ''}`} onClick={() => { sendPlay(7) }}>{(grid[7] === 0 ? 'X' : grid[7] === 1 ? 'O' : '')}</div>
          <div className={`td ${(grid[8] === -1 && isPlayerOnTurn) ? 'active' : ''}`} onClick={() => { sendPlay(8) }}>{(grid[8] === 0 ? 'X' : grid[8] === 1 ? 'O' : '')}</div>
        </div>
      </div>
    </div>
  </>
}

export default GamePlay;