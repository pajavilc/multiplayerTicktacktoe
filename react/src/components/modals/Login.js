import { useState } from "react";
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { LoginAPI } from "../../API/fetch";
import { LoginReduxAction } from "../../REDUX/actions/loginActions";
import cross from '../../svgs/cross-solid.svg'

function Login({ onClose }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    function submitLoginForm(e) {
        e.preventDefault();
        LoginAPI(username, password).then((data) => {
            dispatch(LoginReduxAction(data))
            onClose();
        }).catch(err => alert(err.response.data));

    }

    return <>
        <div className="hide" onClick={() => {
            onClose();
        }}></div>
        <div className="loginHolder">

            <h2 align='center'>Login</h2>

            <img src={cross} className="closePoppup" alt="Close" onClick={() => {
                onClose();
            }} />

            <form onSubmit={submitLoginForm} >
                <div className="username">
                    <label for="uname">Username:</label>
                    <br />
                    <input align='centre' type="text" placeholder='user123' onChange={(e) => { setUsername(e.target.value) }} autoFocus={true} />
                </div>

                <div className="password">
                    <label for="password">Password:</label>
                    <br />
                    <input type="password" placeholder='*****' onChange={(e) => { setPassword(e.target.value) }} />
                    <Link to='?modalId=4' className='formClickable'>Forgot password?</Link>
                </div>


                <input type="submit" value="Login" />
                <div className="alignDown">
                    <p> Not a member? </p>
                    <Link to='?modalId=2'> Sign up now</Link>
                </div>

            </form>

        </div>
    </>
}

export default Login;