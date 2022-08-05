import { createContext } from "react";
import onMessageParse from "../../API/ws";
import { useSelector, useDispatch } from "react-redux";
import { selectUsername } from "../../REDUX/selectors/selectors";

const WebSocketContext = createContext(null)

function WsContext({ children }) {
    const dispatch = useDispatch();
    const username = useSelector(selectUsername);
    if (username === null) return <>{children}</>
    let ws = new WebSocket((window.location.protocol === 'http' ? 'ws://' : 'wss://') + window.location.hostname);

    ws.onclose = () => {
        ws = null;
        setTimeout(() => { ws = new WebSocket((window.location.protocol === 'http' ? 'ws://' : 'wss://') + window.location.hostname) }, 5000);
    }
    ws.onmessage = (event) => {
        onMessageParse(ws, event, dispatch);
    }

    return <WebSocketContext.Provider value={ws}>
        {children}
    </WebSocketContext.Provider>
}

export { WebSocketContext };
export default WsContext