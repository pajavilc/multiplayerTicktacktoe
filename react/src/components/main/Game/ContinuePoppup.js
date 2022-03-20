import { useSelector } from "react-redux";
import reactDom from 'react-dom';
import '../../../styles/ContinuePoppup.css'
import { selectUsername, selectEndStatus } from "../../../REDUX/selectors/selectors";


function ContinuePoppup({ score, sendToggle, sendExit, players }) {
    const endStatus = useSelector(selectEndStatus)
    const username = useSelector(selectUsername);
    const result = endStatus.gameResult === 'win' ? (players[endStatus.lastPlayer] === username ? 'win' : 'lose') : 'tie';
    const gameResult = result === 'win' ? 'You won' : result === 'lose' ? 'You lost' : 'Tie';
    return reactDom.createPortal(<>
        <div className="hide"></div>
        <div className="continue center">
            <div className={`status ${result}`}>{gameResult}</div>
            <div className="userScore">
                <p>{players[0]}</p>
                <div className="score">{score[0]}&nbsp;:&nbsp;{score[1]}</div>
                <p>{players[1]}</p>
            </div>
            <div className="buttons">
                <div className="continueButton" onClick={sendToggle}>Continue</div>
                <div className="exitButton" onClick={sendExit}>Exit</div>
            </div>
        </div>
    </>, document.getElementById('portal'))

}
export default ContinuePoppup;