import { cartsModel } from '../db/models/carts.model.js';

class CartManager {
    async addCart() {
        const newCart = {products: []};
        const response = await cartsModel.create(newCart);
        return response;
    }

    async getCart() {
        const response = await cartsModel.find().lean();
        return response;
    }

    async getCartByID(id) {
        const response = await cartsModel.findById(id).populate("products.product", ["name", "price"])
        return response;
    }

    async addProductToCart(idCart, idProduct){
        const cart = await cartsModel.findById(idCart);
        if (!idCart){
            return ("No encontramos el carrito indicado.")
        } else {
            const productIndex = cart.products.findIndex((p) => p.product.equals(idProduct));
            if (productIndex === -1 ){
                cart.products.push({product: idProduct, quantity: 1});
            } else {
                cart.products[productIndex].quantity++;
            }
            return cart.save()
        }
    }
}

export const cartManager = new CartManager();