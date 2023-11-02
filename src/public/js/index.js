const socketClient = io();

const form = document.getElementById("form");
const iprice = document.getElementById("price")
const pricePro = document.getElementById("pricePro")

form.onsubmit = (e) => {
    e.preventDefault();
    const price = iprice.value;
    socketClient.emit("newPrice", price)
}

socketClient.on("priceUpdated", (price) => {
    pricePro.innerText = price[0].title;
})