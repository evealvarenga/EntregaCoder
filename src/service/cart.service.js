import { cartManager } from "../daos/cartsManager.js";

export const findAllCart = () => {
    const carts = cartManager.findAllCart()
    return carts
}

export const findById = (id) =>{
    const cart = cartManager.findCartById(id)
    return cart
}

export const createOne = (obj) => {
    const createdCart = cartManager.createOneCart(obj)
    return createdCart
}

export const addProductToCart = (cid,pid) => {
    const cartMod = cartManager.addProductToCart(cid,pid)
    return cartMod
}

export const deleteOne = (cid,pid) => {
    const cartmod = cartManager.deleteProductToCart(cid,pid)
    return cartmod
}

export const deleteAll = (cid) => {
    const cartdel = cartManager.deleteCartById(cid)
    return cartdel
}

export const updateCart = (cid,pid,q) =>{
    const cartMod = cartManager.addProductToCartQuantity(cid,pib,q)
    return cartMod
}