import '../../styles/Sidebar.css';
import SideChat from './SideChat';
import { useState } from 'react'
import SideStatistics from './SideStatistics';
import badge from '../../svgs/badge.svg';
import menu from '../../svgs/menu.svg'
import chat from '../../svgs/chat.svg'



function Sidebar() {
    const animTime = 190;
    const [isChat, toggleChat] = useState(true);
    const [sideBarStatus, toggleHide] = useState('hidden');


    function hide() {
        toggleHide('anim');
        setTimeout(() => {
            toggleHide('hidden');
        }, animTime)
    }


    if (sideBarStatus === 'hidden') {
        return <>
            <div className="sideMenu_hidden"><img onClick={() => { toggleHide('show') }} className="toggleMenuSVG" src={menu} alt="toggle menu" /></div>
        </>
    }
    return <div className={`sideMenu ${sideBarStatus === 'anim' ? 'backAnim' : ''}`} >
        <div className="iconsCont">
            <img onClick={hide} className="menuSVG" src={menu} alt="menu" />
            <img onClick={() => { toggleChat(true) }} className={`chatSVG ${isChat ? 'active' : ''}`} src={chat} alt="chat" />
            <img onClick={() => { toggleChat(false) }} className={`statsSVG ${isChat ? '' : 'active'}`} src={badge} alt="Stats" />
        </div>

        <div className="sideContent">
            {isChat ? <SideChat></SideChat> : <SideStatistics></SideStatistics>}
        </div>
    </ div>
}




export default Sidebar