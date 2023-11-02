const socketClient = io();

const chat = document.getElementById("chat");
const message = document.getElementById("message");
const user = document.getElementById("user");
const formChat = document.getElementById("chatForm");

formChat.onsubmit = (e) => {
    e.preventDefault();
    const objMessage = {
        user:user.value,
        message:message.value
    }
    socketClient.emit("newMessage",objMessage);
};

socketClient.on("sendMessage", (messages) => {
    const newMessages = messages.map(m=>{
        const msn =  `<h3>${m.user}</h3>
        <div>${m.message}</div>`
        return msn
    }).join(" ")
    chat.innerHTML = newMessages
});