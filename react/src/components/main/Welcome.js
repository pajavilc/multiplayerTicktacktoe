import { NavLink } from "react-router-dom";
import '../../styles/Welcome.css'
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import ticktacktoe from '../../pngs/ticktacktoe.png'

const getLogin = (state => state.login.username)


function Welcome() {
    const navigate = useNavigate();
    const username = useSelector(getLogin)



    function CreateGame() {
        navigate('/game?quickActions=1')
    }
    function ViewStat() {
        navigate('/scoreboard')
    }
    function QuickMatch() {
        navigate('/game?quickActions=2')
    }






    return <div className="welcome">
        <section className="game">
            {username !== null ? <>
                <h1>Welcome {username}</h1>
                <div className="buttons">
                    <div className="button" onClick={CreateGame}>Create a game</div>
                    <div className="button" onClick={ViewStat}>View your stats</div>
                    <div className="button" onClick={QuickMatch}>Start a quick match</div>
                </div></> : <>
                <h1>You are not signed in</h1>
                <div className="text">
                    <p>For further access to the website, please, <NavLink to={'?modalId=1'}><bold>sign in.</bold></NavLink></p>
                    <p>New?  <NavLink to={'?modalId=2'}><bold>Sign up instead</bold></NavLink></p>
                </div>
            </>}
            <img src={ticktacktoe} alt='' />
        </section>
        <section className="links">
            <div className="left">
                <h2>See my projects</h2>
                <p>---------------</p>
            </div>
            <div className="right">
                <h2>Contact me</h2>
                <p>---------------</p>
            </div>
        </section>
    </div>
}
export default Welcome;