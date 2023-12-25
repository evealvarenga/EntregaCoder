import { cartManager } from "../DAL/daos/mongo/carts.dao.js";


export const findAllCart = () => {
    return cartManager.findAllCart()
}

export const findById = (id) => {
    return cartManager.findCartById(id)
}

export const createOne = (obj) => {
    return cartManager.createOneCart(obj)
}

export const addProductToCart = (cid, pid) => {
    return cartManager.addProductToCart(cid, pid)
}

export const deleteOne = (cid, pid) => {
    return cartManager.deleteProductToCart(cid, pid)
}

export const deleteAll = (cid) => {
    return cartManager.deleteCartById(cid)
}

export const updateCart = (cid, pid, q) => {
    return cartManager.addProductToCartQuantity(cid, pid, q)
}