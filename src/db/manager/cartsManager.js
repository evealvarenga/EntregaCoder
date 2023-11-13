import { cartsModel } from "../models/carts.model.js";

class CartManager {
    constructor() {
        this.path = "src/cart.json";
    }

    async findAllCart() {
        const response = await cartsModel.find();
        return response;
    };

    async findCartById(idCart) {
        const response = await cartsModel.findById(idCart).populate("products.product");
        return response;
    };

    async createOneCart() {
        const newCart = { products: [] };
        const response = await cartsModel.create(newCart);
        return response;
    };

    async addProductToCart(idCart, idProduct) {
        const cart = await cartsModel.findById(idCart);
        const productIndex = cart.products.findIndex(
            (item) => item.product.equals(idProduct)
        );
        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({ product: idProduct, quantity: 1 });
        }
        return cart.save()

    };

    async addProductToCartQuantity(idCart, idProduct, quantity) {

        const cart = await cartsModel.findById(idCart);

        const productIndex = cart.products.findIndex(
            (item) => item.product.equals(idProduct)
        );

        if (productIndex !== -1) {

            cart.products[productIndex].quantity = quantity;
        } else {
            cart.products.push({ product: idProduct, quantity: 1 });
        }

        return cart.save()

    };

    async updateCart(cartId, newProductBody) {

        const cartById = await cartsModel.findById(cartId);
        const newProduct = newProductBody;
        console.log(cartById.products);
        cartById.products = newProduct;
        await cartById.save()
        return cartById

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