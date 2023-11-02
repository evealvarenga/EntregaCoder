import { cartsModel } from '../db/models/carts.model.js';

class CartManager {
    async addCart() {
        const newCart = { products: [] };
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

    async quantityUpdate(idCart, idProduct, quantity) {
        const cart = await cartsModel.findById(idCart);
        if (!cart) {
            return ("No encontamos el carrito indicado.")
        }
        const productIndex = cart.products.findIndex((p) => p.product.equals(idProduct))
        if (productIndex === -1) {
            return ("No encontamos el producto indicado.")
        } else {
            cart.products[productIndex] = quantity
        }
        return cart.save();
    }

    async deleteProductOfCart(idCart,idProduct){
        const cart = await cartsModel.findById(idCart);
        if(!cart){
          return("No encontamos el carrito indicado.")
        }
        const productIndex = cart.products.findIndex((p) => p.product.equals(idProduct))
        if (productIndex === -1){
          return("No encontamos el producto indicado.")
        } else{
          cart.products.splice(productIndex,1)
        }
        return cart.save();
    }

    async cartUpdate(idCart, newProducts) {
        const cart = await cartsModel.findById(idCart);
        if (!cart) {
            return ("No encontamos el carrito indicado.")
        }
        cart.products = newProducts.products
        return cart.save();
    }

    async addProductToCart(idCart, idProduct) {
        const cart = await cartsModel.findById(idCart);
        const productIndex = cart.products.findIndex((p) => p.product.equals(idProduct));
        if (productIndex === -1) {
            cart.products.push({ product: idProduct, quantity: 1 });
        } else {
            cart.products[productIndex].quantity++;
        }
        return cart.save()
    }

    async deleteCartProducts(idCart){
        const cart = await cartsModel.findById(idCart);
        if(!cart){
          return("No encontamos el carrito indicado.")
        }
        cart.products = []
        return cart.save();
    }
}

export const cartManager = new CartManager();