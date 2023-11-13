const socketClient = io();
const userName = document.getElementById("name");
const formChat = document.getElementById("chatForm");
const inputMessage = document.getElementById("message");
const inputEmail = document.getElementById("emailUser");
const chatContainer = document.getElementById("chatContainer");

let nameUser;

Swal.fire({
    title: 'Bienvenido',
    text: 'Cual es tu nombre',
    input: 'text',

    inputValidator: (value) => {
        if (!value) {
            return "Su nombre es requerido"
        }

    },
    confirmButtonText: 'Enter'
}).then((input) => {
    nameUser = input.value
    userName.innerText = nameUser;
    socketClient.emit("newUser", nameUser);
});

socketClient.on("userConnected", (nUser) => {
    Toastify({
        text: `${nUser} connected`,
        duration: 5000,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
})


formChat.onsubmit = (e) => {
    e.preventDefault();
    const infoMessage = {
        name: nameUser,
        user: inputEmail.value,
        message: inputMessage.value
    }
    socketClient.emit("message", infoMessage)
}

socketClient.on("chatTotal", (messageT) => {
    const chatT = messageT.map((m) => { return `<p> ${m.name} dijo: ${m.message}</p>` }).join(" ");
    chatContainer.innerHTML = chatT;
})


