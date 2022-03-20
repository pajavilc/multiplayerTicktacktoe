import Message from "../prefabs/Message";
import { useSelector } from "react-redux";
import { useContext, useState, useEffect } from "react";
import { WebSocketContext } from "../prefabs/websocket";
import '../../styles/Chat.css'
import { makeResponse } from "../../API/ws";
import { ResponseIdEnum } from "../../API/responses";
import { selectMessages, selectChatStatus, selectUsername } from "../../REDUX/selectors/selectors";
import sendIcon from "../../svgs/send.svg"

function Messages({ messages }) {
    const username = useSelector(selectUsername);

    const MessageList = () => {
        let x = messages.map((message, index) => {
            return (<Message key={index} from={message.from} message={message.message} isUser={message.from === username}></Message>)
        })
        return x;
    }
    return <>{MessageList()}</>;
}

function SideChat() {
    const ws = useContext(WebSocketContext);
    const status = useSelector(selectChatStatus);
    const messages = useSelector(selectMessages);

    const [message, setMessage] = useState('');


    useEffect(() => {
        const container = document.getElementById('scroll');
        if (container === null) return
        container.scrollTop = container.scrollHeight;
    }, [messages])

    function submitNewMessage(e) {
        e.preventDefault();
        if (message === '') return
        ws.send(makeResponse(ResponseIdEnum.SEND_CHAT_MESSAGE, {
            message: message
        }))
        setMessage('');
    }

    if (status !== 'inGame') {
        return <div className="messages">
            <div className="messagesHolder">
                <div className="notInGame">Chat only works in game.</div>
            </div>
            <form className="submitForm" >
                <div className="middle">
                    <input type="text" className="textHolder" disabled="disabled" placeholder="Message" />
                    <button type="submit" className="button disable" disabled="disabled" >
                        <p>Submit</p>
                        <img src={sendIcon} alt="sendMessage" />
                    </button>
                </div>
            </form>
        </div>

    }
    return <div className="messages">
        <div className="messagesHolder" id='scroll'>
            <Messages messages={messages}></Messages>
        </div>

        <form className="submitForm" onSubmit={submitNewMessage}>
            <div className="middle">
                <input type="text" className="textHolder" placeholder="Message" value={message} onChange={(e) => { setMessage(e.target.value) }} />
                <button type="submit" className="button" >
                    <p>Submit</p>
                    <img src={sendIcon} alt="sendMessage" />
                </button>
            </div>
        </form>
    </div >

}


export default SideChat;