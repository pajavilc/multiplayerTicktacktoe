import '../../styles/Scoreboard.css';
import { GetUserStats } from "../../API/fetch";
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { PieChart } from '../prefabs/PieChart';
import { selectUsername } from '../../REDUX/selectors/selectors';
import { useNavigate } from 'react-router-dom';

function Chart({ label, color, wins, games }) {
    return <div className="chart">
        <div className="header">{label}</div>
        <div className="middle">
            <div className="stats">
                <div className="games">
                    <p>Games</p>
                    <p>{games}</p>
                </div>
                <div className="wins">
                    <p>Wins</p>
                    <p>{wins}</p>
                </div>
            </div>
            <div className="graph">
                <p>Winrate</p>
                {games !== 0 ? <PieChart color={color} percentage={(wins / games) * 100}></PieChart> : <p>No data</p>}
            </div>
        </div>
        <div className="bottom"></div>
    </div>
}

function Scoreboard() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        winsTotal: 0,
        winsToday: 0,
        winsThisWeek: 0,
        gamesTotal: 0,
        gamesToday: 0,
        gamesThisWeek: 0
    });
    const username = useSelector(selectUsername);

    useEffect(() => {
        if (username !== null) {
            GetUserStats().then((_data) => {
                setData(_data[0])
            }).catch(err => alert(err))
        }

    }, [username])
    useEffect(() => {
        if (username === null) {
            navigate('?modalId=1')
        }
    }, [])
    return <>
        <div className="statistics">
            <div className="left">
                <Chart label={"Total"} color={'#aeff00'} wins={data.winsTotal} games={data.gamesTotal}></Chart>
                <Chart label={"Today"} color={'#0d47a1'} wins={data.winsToday} games={data.gamesToday}></Chart>
            </div>
            <div className="right">
                <Chart label={"This week"} color={'#f80505'} wins={data.winsThisWeek} games={data.gamesThisWeek}></Chart>
            </div>
        </div>
    </>
}

export default Scoreboard;