

function GameInfoPref({handle,info,gameId}){
    let player1 = info.players[0];
    let player2 = info.players[1]
    let score = `${info.score[0]} : ${info.score[1]}`;

    function isFull(){
        return (player1 !== null && player2 !== null);
    }

    return <div className="gameInfo">
        <div className="gameId"><p>{gameId+1}.</p></div>
    <div className="box">
        <div className="up">
            <div className="player1">{player1}</div>
            <div className="score">{score}</div>
            <div className="player2">{player2}</div>
        </div>
        <div className="down">
            <div className={`button_join ${(isFull()?'cannot_join':'can_join')}`} onClick={()=>{if(!isFull()){handle(true,gameId)}}}><p>Join</p></div>
            <div className={`button_spectate can_join`} onClick={()=>{handle(false,gameId)}}><p>Watch</p></div>
        </div>

    </div>
    </div>
}

export default GameInfoPref