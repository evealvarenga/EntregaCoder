const socketClient = io();

const formProducts = document.getElementById("form-products");

formProducts.onsubmit = (e)=>{
    e.preventDefault();
    socketClient.emit("showProducts");
}