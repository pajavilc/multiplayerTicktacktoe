import cross from '../../svgs/cross-solid.svg'
import { useContext } from 'react';
import { makeResponse } from '../../API/ws';
import { WebSocketContext } from '../prefabs/websocket';
import { ResponseIdEnum } from '../../API/responses';
import '../../styles/LeaveGame.css';
import { useSelector } from 'react-redux';
import { selectGameStatus } from '../../REDUX/selectors/selectors';

function LeaveGame({ onClose, exit }) {
    let nextAdrress;
    const params = new URLSearchParams(window.location.search);
    nextAdrress = params.get("goNext") || '';
    const ws = useContext(WebSocketContext);
    const gameStatus = useSelector(selectGameStatus)

    function sendExit() {
        if (gameStatus === 'spectator') {
            ws.send(makeResponse(ResponseIdEnum.DISCONNECT_SPECTATOR));
        }
        else {
            ws.send(makeResponse(ResponseIdEnum.DISCONNECT))
        }
        nextAdrress !== '' && exit(nextAdrress);

    }
    return <>
        <div className="hide" onClick={() => {
            onClose();
        }}></div>
        <div className="loginHolder leave">
            <h2 align='center'>Do you want to leave?</h2>
            <div className="middle">
                If you continue, you will leave the game.
            </div>
            <button onClick={sendExit}>Leave</button>
            <button onClick={onClose}>Get back to game</button>
            <img src={cross} className="closePoppup" alt="Close" onClick={() => { onClose() }} />
        </div>
    </>
}
export default LeaveGame;