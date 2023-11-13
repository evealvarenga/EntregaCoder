import { promises, existsSync } from 'fs'
import ProductManager from './productManager.js';

const manager = new ProductManager('./src/productos.json');

class CartManager {
    constructor(path) {
        this.path = path
    }

    async addCart() {
        const carts = await this.getCart();
        let id;
        if (!carts.length) {
            id = 1;
        } else {
            id = carts[carts.length - 1].id + 1;
        }
        const newCarts = [...carts, { id: id, products: [] }];
        await fs.promises.writeFile(this.path, JSON.stringify(newCarts));
        return "cart created";
    }

    async getCart() {
        try {
            if (fs.existsSync(this.path)) {
                const cartFile = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(cartFile);
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }

    async getCartById(id) {
        try {
            const cart = await this.getCart();
            const cartFiltrado = cart.find((item) => item.id === id);
            return cartFiltrado;
        } catch (error) {
            return error;
        }
    }

    async addProductInCart(cId, pId) {
        const cartById = await this.getCartById(cId);
        const productById = await productManager.getProductById(pId);
        if (!cartById) {
            return "Cart not found";
        }
        if (!productById) {
            return "Product not found";
        }
        const productIndex = cartById.products.findIndex(
            (item) => item.productId === pId
        );
        const cartFilter = await this.deleteCartById(cId);
        if (productIndex !== -1) {
            cartById.products[productIndex].quantity++;
        } else {
            cartById.products.push({ productId: pId, quantity: 1 });
        }
        const newCarts = [{ ...cartById }, ...cartFilter];
        await fs.promises.writeFile(this.path, JSON.stringify(newCarts));
    }

    async deleteCartById(id) {
        try {
            const cart = await this.getCart();
            const cartFiltrado = cart.find((item) => item.id === id);
            if (cartFiltrado) {
                const cart2 = cart.filter((item) => item.id != id);
                await fs.promises.writeFile(this.path, JSON.stringify(cart2));
                return cart2;
            } else {
                return cartFiltrado;
            }
        } catch (error) {
            return error;
        }
    }

}

export default CartManager;