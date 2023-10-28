import { promises, existsSync } from 'fs'
import ProductManager from './ProductManager.js';

const manager = new ProductManager('./src/productos.json');

class CartManager {
    constructor(path) {
        this.path = path
    }

    async addCart() {
        try {
            const carts = await this.getCart()
            let id
            if (!carts.length) {
                id = 1
            } else {
                id = carts[carts.length - 1].id + 1
            }
            const newCart = { id, products: [] };
            carts.push(newCart);
            await promises.writeFile(this.path, JSON.stringify(carts))
            return newCart
        } catch (error) {
            return error
        }
    }

    async getCart(queryObj) {
        const { limit } = queryObj;
        try {
            if (existsSync(this.path)) {
                const productFile = await promises.readFile(this.path, 'utf-8')
                const productData = JSON.parse(productFile);
                return limit ? productData.slice(0, +limit) : productData;
            } else {
                return []
            }
        } catch (error) {
            return error
        }
    }

    async getCartByID(id) {
        try {
            const products = await this.getCart()
            const product = products.find(u => u.id === id)
            return product;
        } catch (error) {
            return error
        }
    }

    async addProductToCart(idCart, idProduct){
        const cart = await this.getCartByID(idCart)
        if (!cart){
            throw new Error('No se encontró un carrito con el ID indicado.')
        }
        const product = await manager.getProductsByID(idProduct)
        if (!product){
            throw new Error('No se encontró un producto con el ID indicado.')
        }
        const productIndex = cart.products.findIndex(p => p.id === idProduct)
        if (productIndex === -1){
            const NewProduct = { product:idProduct , quantity:1}
            cart.product.push(NewProduct)
        } else {
            cart.products[productIndex].quantity++;
        }

    }

}

export default CartManager;