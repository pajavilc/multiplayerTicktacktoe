import './styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';

import Nav from './components/Nav';
import Game from './components/main/Game';
import Welcome from './components/main/Welcome'
import Sidebar from './components/side/Sidebar';
import Scoreboard from './components/main/Scoreboard';
import Popup from './components/modals/AccountPopup';
import { Relogin } from './API/fetch';
import WsContext from './components/prefabs/websocket';
import { useDispatch } from 'react-redux';
import { LoginReduxAction } from './REDUX/actions/loginActions';
import { BrowserRouter } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    Relogin().then((data) => {
      dispatch(LoginReduxAction(data))
    }).catch(err => {/*do nothing*/ })

  }, [])

  return (<>
    <WsContext>
      <BrowserRouter basename='/app'>
        <div className='flexHeaderWContent'>
          <header id='navBar'>
            <Nav />
          </header>

          <div id="flexContent">
            <div id="main">
              <Routes>
                <Route exact path='/' element={<Welcome></Welcome>} />
                <Route exact path='/game' element={<Game></Game>} />
                <Route exact path='/scoreboard' element={<Scoreboard />} />
                <Route render={() => <h1>404:  page not found</h1>}></Route>
              </Routes>

            </div>
            <Sidebar></Sidebar>
          </div>
        </div>
        <div className="popupSpace">
          <Popup></Popup>
        </div>
      </BrowserRouter>
    </WsContext>
  </>);
}

export default App;
