import BasicMongo from "./basic.dao.js";
import { cartsModel } from "../../models/carts.model.js";

class CartManager extends BasicMongo{
    constructor(){
        super(cartsModel)
    }

    async findCartById(id) {
        const response = await cartsModel.findById(id).populate("products.product");
        return response
    };

    async createOneCart() {
        const cart = { products: [] };
        const response = await cartsModel.create(cart);
        return response
    };

    async addProductToCart(idC, idP) {
        const cart = await cartsModel.findById(idC);
        const productIndex = cart.products.findIndex(
            (item) => item.product.equals(idP)
        );
        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({ product: idP, quantity: 1 });
        }
        return cart.save()

    };

    async addProductToCartQuantity(idC, idP, quantity) {
        const cart = await cartsModel.findById(idC);
        const productIndex = cart.products.findIndex(
            (item) => item.product.equals(idP)
        );
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            cart.products.push({ product: idP, quantity: 1 });
        }
        return cart.save()
    };

    async updateCart(idC, obj) {
        const cart = await cartsModel.findById(idC);
        const newProduct = obj;
        cart.products = newProduct;
        await cart.save()
        return cart
    };

    async deleteCartById(idCart) {
        try {
            const response = await cartsModel.deleteOne({ _id: idCart });
            return response
        } catch (error) {
            return error;
        }
    }
    
    async deleteProductToCart(idCart, idProduct) {
        const cart = await cartsModel.findById(idCart);
        if (!cart) { console.log("CARRITO NO ENCONTRADO"); }
        const productIndex = cart.products.findIndex(p => p.product._id.equals(idProduct));
        if (productIndex === -1) { console.log("PRODUCTO NO ENCONTRADO EN CARRITO"); }
        cart.products.splice(productIndex, 1);
        await cart.save();
        return cart;
    };

    async deleteTotalProductToCart(idCart) {
        const cart = await cartsModel.findById(idCart);
        cart.products = [];
        await cart.save()
        return cart
    };
}

export const cartManager = new CartManager()