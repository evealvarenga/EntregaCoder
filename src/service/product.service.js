import { productManager } from "../daos/productManager.js";


export const findAll = () => {
    const products = productManager.findAll();
    return products;
};

export const findById = (id) => {
    const product = productManager.findById(id);
    return product;
};

export const createOne = (obj) => {
    const createdProduct = productManager.createOne(obj);
    return createdProduct;
};

export const deleteOneProduct = (pid) => {
    const productDelete = productManager.deleteOne(pid);
    return productDelete;
};

export const updateProduct = (pid, obj) => {
    const productModific = productManager.updateOne( pid, obj);
    return productModific;
};