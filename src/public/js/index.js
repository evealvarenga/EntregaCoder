const socketClient = io();

const formAddProduct = document.getElementById('form-add')
const formDelProdcut = document.getElementById('form-delet')

const title = document.getElementById('title')
const description = document.getElementById('description')
const code = document.getElementById('code')
const price = document.getElementById('price')
const stock = document.getElementById('stock')
const number = document.getElementById('number')

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

formDelProdcut.onsubmit =  (e) => {
    e.preventDefault()
    let id
    id = number.value
    socketClient.emit('id', id)
}