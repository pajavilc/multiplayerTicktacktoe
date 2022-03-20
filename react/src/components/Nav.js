import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/Nav.css";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogoutReduxAction } from "../REDUX/actions/loginActions";
import { selectGameStatus, selectUsername } from "../REDUX/selectors/selectors";
import cross from '../svgs/cross-white.svg';
import menu from '../svgs/location-map-outline.svg'

function Nav() {
  const animTime = 110;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAccMenu, toggleAccMenu] = useState(false);
  const [showNav_Mobile, toggleshowNav_Mobile] = useState(false);
  useLocationChange(() => {
    if (showNav_Mobile === false) { return }
    toggleshowNav_Mobile('anim');
    setTimeout(() => { toggleshowNav_Mobile(false) }, animTime)
  });
  const username = useSelector(selectUsername);
  const gameStatus = useSelector(selectGameStatus);
  useEffect(() => {
    if (gameStatus !== "IN_LOBBY" && location.pathname !== '/game') {
      navigate('/game');
    }

  }, [gameStatus])

  function logout() {
    try {
      dispatch(LogoutReduxAction());
    } catch { }
    navigate('/');
    toggleAccMenu(false);
  }

  function handleUser() {
    if (username === null) {
      navigate("?modalId=1");
    } else {
      toggleAccMenu(!showAccMenu);
    }
  }

  return (
    <>
      <div className={`nav ${showNav_Mobile !== false ? 'showNav' : ''} ${showNav_Mobile !== 'anim' ? '' : 'anim'}`}>
        <div className="mobOptions"><img className="cross" onClick={() => { toggleshowNav_Mobile('anim'); setTimeout(() => { toggleshowNav_Mobile(false) }, animTime) }} src={cross} alt="close" /></div>
        <div className="menuIcon" onClick={() => { toggleshowNav_Mobile(true) }}><img src={menu} alt="Open menu" /></div>

        <ul>
          <li className="main">
            <NavLink className={`${location.pathname === '/' ? 'activeLocation' : ''}`} to={`${gameStatus === "IN_LOBBY" ? '/' : '?modalId=3&goNext=/'}`}>
              <p>Main</p>
            </NavLink>
          </li>
          <li className="game">
            <NavLink className={`${location.pathname === '/game' ? 'activeLocation' : ''}`} to='/game'>
              <p>Game</p>
            </NavLink>
          </li>
          <li className="scoreboard">
            <NavLink active className={`${location.pathname === '/scoreboard' ? 'activeLocation' : ''}`} to={`${gameStatus === "IN_LOBBY" ? '/scoreboard' : '?modalId=3&goNext=scoreboard'}`} ah>
              <p>Scoreboard</p>
            </NavLink>
          </li>
          <li className="user_Mobile">
            {username === null ? <div onClick={() => { navigate("?modalId=1"); }}> Login </div> : <div onClick={logout}>Logout</div>}
          </li>
        </ul>
        <div className="userNav">
          <div className="user" onClick={handleUser}>
            {username !== null ? username : "Login"}
          </div>
          {showAccMenu && (
            <div className="menu">
              <div className="logout" onClick={logout}>
                Logout
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );

}
const useLocationChange = (action) => {
  const location = useLocation()
  useEffect(() => { action() }, [location])
}
export default Nav;
