import "../../styles/Game.css";
import React from "react";
import GameLobby from "./Game/GameLobby";
import GamePlay from "./Game/GamePlay";
import { useSelector } from "react-redux";
import { selectGameStatus } from "../../REDUX/selectors/selectors";

function Game() {
  const status = useSelector(selectGameStatus);

  return <>
    {status === 'IN_LOBBY' ? <GameLobby /> : <GamePlay />}
  </>;
}

export default Game;
