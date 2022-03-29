import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import GameInfoPref from "../../prefabs/GameInfoPref";
import { WebSocketContext } from "../../prefabs/websocket";
import { LoadGameData } from "../../../REDUX/actions/gameActions";
import dropdown from "../../../svgs/dropdown_PH.svg";
import filter from "../../../svgs/filter-outline.svg";
import { makeResponse } from '../../../API/ws';
import { ResponseIdEnum } from "../../../API/responses";
import { selectGames, selectUsername } from "../../../REDUX/selectors/selectors";
import { useLocation } from "react-router-dom";



function GameLobby() {
  const navigate = useNavigate();
  const username = useSelector(selectUsername);
  const dispatch = useDispatch();
  const location = useLocation();
  const ws = useContext(WebSocketContext);
  const gameInfos = useSelector(selectGames);
  const [filterState, setFilterState] = useState('All');
  const [numberOfLobbies, setNumberOfLobbies] = useState([0, 12]);

  useEffect(() => {
    dispatch(LoadGameData());
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(LoadGameData());
    }, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  function handleJoin(gameId) {
    ws.send(makeResponse(ResponseIdEnum.JOIN_GAME, { gameId: gameId }));
  }
  function handleSpectate(gameId) {
    ws.send(makeResponse(ResponseIdEnum.JOIN_SPECTATOR, { gameId: gameId }));

  }
  function randomJoin() {
    if (username === null) {
      navigate('?modalId=1')
      return;
    }
    let listOfChoices = [];
    for (let i = 0; i < gameInfos.length; i++) {
      if (!((gameInfos[i].players[0] === null && gameInfos[i].players[1] !== null) || (gameInfos[i].players[0] !== null && gameInfos[i].players[1] === null))) continue;
      listOfChoices[listOfChoices.length] = i;
    }
    if (listOfChoices.length === 0) {
      alert('No available game. Consider creating instead.');
      return;
    }
    let gameId = Math.round(Math.random() * listOfChoices.length);

    ws.send(makeResponse(ResponseIdEnum.JOIN_GAME, { gameId: gameId }));
  }

  function createGame() {
    if (username === null) {
      navigate('?modalId=1')
      return;
    }
    ws.send(makeResponse(ResponseIdEnum.CREATE_GAME, {}));
  }

  useEffect(() => {
    onLocationChange();
  }, [location]);

  function onLocationChange() {
    const params = new URLSearchParams(window.location.search);
    const x = parseInt(params.get("quickActions") || -1);
    if (x === -1 || username === null) return
    if (x === 1) createGame();
    if (x === 2) randomJoin();
  }





  const handleMaster = (isPlayer, gameId) => {
    if (isPlayer) {
      return handleJoin(gameId);
    }
    return handleSpectate(gameId);
  };

  const GameInfoList = () => {
    const _numberOfLobbies = [0, 0];
    const x = gameInfos.map((info, index) => {
      if (info.players[0] === null && info.players[1] === null) {
        return <></>
      }
      _numberOfLobbies[1]++;
      if (info.players[0] === null || info.players[1] === null) _numberOfLobbies[0]++;
      if (filterState === 'All' || (info.players[0] === null || info.players[1] === null)) {
        return (<GameInfoPref key={index} gameId={index} handle={handleMaster} info={info}></GameInfoPref>);
      }
      else {
        return <></>
      }
    });
    if (_numberOfLobbies[0] !== numberOfLobbies[0] || _numberOfLobbies[1] !== numberOfLobbies[1]) {
      setNumberOfLobbies(_numberOfLobbies);
    }
    return x;
  }
  return (
    <>
      <div className="container">

        <div className="lobbies_header">
          <div className="left">
            <p className="header2">Lobbies</p>
            <p className="noOfLobbies">
              {numberOfLobbies[0]}/{numberOfLobbies[1]} Open Positions
            </p>
          </div>

          <div className="right">
            <img className="filter_icon" src={filter} alt="" />
            <div className="filter">
              <div className="dropB">
                <img src={dropdown} alt="" />
                {filterState}
              </div>
              <div className="drop_content">
                <div onClick={() => { setFilterState('All') }}> All </div>
                <div onClick={() => { setFilterState('Open') }}> Open </div>
              </div>
            </div>
            <div className="create_game" onClick={() => { createGame() }}>
              <p>Create Game</p>
            </div>
            <div className="join_random" onClick={() => { randomJoin() }}>
              <p>Join Random</p>
            </div>
          </div>
        </div>

        <div className="lobbyField">{GameInfoList()}</div>
      </div>
    </>
  );
}


export default GameLobby;