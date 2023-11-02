const socketClient = io();

const formAddProduct = document.getElementById('form-rtpAdd')
const title = document.getElementById('title')
const description = document.getElementById('description')
const code = document.getElementById('code')
const price = document.getElementById('price')
const stock = document.getElementById('stock')
const number = document.getElementById('number')

const formDelProdcut = document.getElementById('form-rtpDelete')
const idDelete =document.getElementById('idDelete')

formAddProduct.onsubmit =  (e) => {
    e.preventDefault()
    const product = {
        title: title.value,
        description: description.value,
        code: code.value,
        price: price.value,
        stock: stock.value,
    }
    socketClient.emit('product', product)
}

socketClient.on("productUpdated",(products) => {
    const aProducts = products.map(i =>{
        const product = `<div>${i.title}</div>
        <div>${i.description}</div>
        <div>${i.price}</div>
        <div>${i.thumbnail}</div>
        <div>${i.code}</div>
        <div>${i.id}</div>
        <div>${i.stock}</div><br>`
        return product
    }).join("")
    divProductsRealTime.innerHTML = aProducts
})

formDelProdcut.onsubmit =  (e) => {
    e.preventDefault()
    const id = idDelete.value
    socketClient.emit('deleteProduct', id)
}