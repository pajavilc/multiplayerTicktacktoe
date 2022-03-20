import { TwoColoredPieChart } from "../prefabs/PieChart";
import '../../styles/SideStats.css'
import { useSelector } from "react-redux";
import { selectChatStatus, selectPlayers, selectGameStats } from "../../REDUX/selectors/selectors";

function SideStatistics() {
    const names = useSelector(selectPlayers);
    const status = useSelector(selectChatStatus);
    const gameStats = useSelector(selectGameStats);

    const gamesTotals = gameStats.games;
    const winsTotals = gameStats.wins;
    const colors1 = ['#0da117 ', '#124b9d'];
    const colors2 = ['#124b9d', '#0da117 ']
    if (status !== 'inGame') {
        return <div className="notInGame">Stats only work in game.</div>
    }
    return <div className="sideStats">
        <p>Stats</p>
        <div className="player">
            <div className="header">{names[0]}</div>
            <div className="games">Games total:{gamesTotals[0]}</div>
            <div className="graph">
                <p>Winrate</p>
                {gamesTotals[0] !== 0 ? <TwoColoredPieChart color1={colors1[0]} color2={colors1[1]} percentage={(winsTotals[0] / gamesTotals[0]) * 100}></TwoColoredPieChart> : <p>No data</p>}
            </div>
        </div>
        <div className="player">
            <div className="header">{names[1]}</div>
            <div className="games">Games total:{gamesTotals[1]}</div>
            <div className="graph">
                <p>Winrate</p>
                {gamesTotals[1] !== 0 ? <TwoColoredPieChart color1={colors2[0]} color2={colors2[1]} percentage={(winsTotals[1] / gamesTotals[1]) * 100}></TwoColoredPieChart> : <p>No data</p>}
            </div>

        </div>
    </div>
}
export default SideStatistics;