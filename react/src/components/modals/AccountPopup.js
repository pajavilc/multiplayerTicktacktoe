import reactDom from 'react-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import '../../styles/Login.css'
import Login from './Login';
import Register from './Register';
import LeaveGame from './LeaveGame';

function Popup(showAlert) {
    function checkParams() {
        const params = new URLSearchParams(window.location.search);
        setPopId(parseInt(params.get("modalId") || 0));
    }
    const [popId, setPopId] = useState(0);
    useLocationChange(checkParams);
    const navigate = useNavigate();

    return reactDom.createPortal(<>
        {popId === 1 && <Login onClose={() => {
            navigate(('/' + window.location.pathname.split('/')[2]));
        }}></Login>}
        {popId === 2 && <Register onClose={() => {
            navigate(('/' + window.location.pathname.split('/')[2]));
        }} onRegister={() => navigate('?modalId=1')}>
        </Register>}
        {popId === 3 && <LeaveGame onClose={() => {
            navigate(('/' + window.location.pathname.split('/')[2]));
        }} exit={(address) => { navigate(address) }}></LeaveGame>}
    </>,
        document.getElementById('portal'))
}


const useLocationChange = (action) => {
    const location = useLocation()
    useEffect(() => { action(location) }, [location])
}
export default Popup;