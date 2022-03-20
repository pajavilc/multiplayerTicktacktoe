
function Message({ from, message, isUser }) {
    if (!isUser) {
        return <div className="message">
            <div className={`from ${from === "SYSTEM" && 'systemMessage'}`}>{from}:</div>
            <div className="messageContent ">{message}</div>
        </div>
    }
    return <div className="message isUser">
        <div className="from">:{from}</div>
        <div className="messageContent">{message}</div>
    </div>
}
export default Message;