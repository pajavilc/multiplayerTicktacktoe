import { useState } from "react";
import { Link } from 'react-router-dom';
import { RegisterAPI } from "../../API/fetch";
import cross from '../../svgs/cross-solid.svg'

function Register({ onClose, onRegister }) {
    /*const [mail, setMail] = useState("");*/
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function submitRegisterForm(e) {
        e.preventDefault();
        RegisterAPI(username, password, /*mail*/null).then(() => {
            alert('registered fine xd');
            onRegister();
        }).catch((err) => alert(err));

    }


    return <>
        <div className="hide" onClick={() => {
            onClose();
        }}></div>
        <div className="loginHolder">
            <h2 align='center'>Register</h2>
            <img src={cross} className="closePoppup" alt="Close" onClick={() => { onClose() }} />

            <form onSubmit={submitRegisterForm}>
                {/* <div className="mail">
                    <label for="mail">Email:</label>
                    <br />
                    <input align='centre' type="email" placeholder='sample@gmail.com' onChange={(e) => { setMail(e.target.value) }} autoFocus={true} />
                </div>
    */}
                <div className="username">
                    <label for="uname">Username:</label>
                    <br />
                    <input align='centre' type="text" placeholder='user123' onChange={(e) => { setUsername(e.target.value) }} />
                </div>

                <div className="password">
                    <label for="password">Password:</label>
                    <br />
                    <input type="password" placeholder='*****' onChange={(e) => { setPassword(e.target.value) }} />
                </div>
                <input type="submit" value="Register" />

                <div className="alignDown">
                    <p> Already a member? </p>
                    <Link to='?modalId=1'> Log in here.</Link>
                </div>

            </form>


        </div>

    </>
}

export default Register;