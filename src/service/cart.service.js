import { cartManager } from "../DAL/daos/mongo/carts.dao.js";
import { productService } from "./product.service.js";


export const findAllCart = () => {
    const response = cartManager.findAllCart()
    return response
}

export const findById = (id) => {
    const response = cartManager.findCartById(id)
    return response
}

export const createOne = (obj) => {
    const response = cartManager.createOneCart(obj)
    return response
}

export const addProductToCart = async (cid, pid) => {
    /*const product = await productService.findById(pid)
    const cartstatus = await findById(cid)
    const total = product.price + cartstatus.subtotal
    const stotal = await cartManager.updateTotal(cid, total)*/
    const response = await cartManager.addProductToCart(cid, pid)
    return response
}

export const deleteOne = (cid, pid) => {
    const response = cartManager.deleteProductToCart(cid, pid)
    return response 
}

export const deleteAll = (cid) => {
    const response = cartManager.deleteCartById(cid)
    return response
}

export const updateCart = (cid, pid, q) => {
    const response = cartManager.addProductToCartQuantity(cid, pid, q)
    return response
}
