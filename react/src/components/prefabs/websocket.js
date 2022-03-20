import { createContext } from "react";
import onMessageParse from "../../API/ws";
import { useSelector, useDispatch } from "react-redux";
import { selectUsername } from "../../REDUX/selectors/selectors";

const WebSocketContext = createContext(null)

function WsContext({ children }) {
    const dispatch = useDispatch();
    const username = useSelector(selectUsername);
    if (username === null) return <>{children}</>
    const ws = new WebSocket('ws://' + window.location.hostname);

    ws.onmessage = (event) => {
        onMessageParse(ws, event, dispatch);
    }

    return <WebSocketContext.Provider value={ws}>
        {children}
    </WebSocketContext.Provider>
}

export { WebSocketContext };
export default WsContext