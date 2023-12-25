import { findAllCart, findById, createOne, addProductToCart, deleteOne, deleteAll, updateCart } from "../service/cart.service.js";
import { productService } from "../service/product.service.js";
import { cartManager } from "../DAL/daos/mongo/carts.dao.js";
import { createOneTicket } from "./ticket.controller.js";
import { v4 as uuidv4 } from "uuid";

export const findCartById = async (req,res) => {
    const { cid } = req.params
    try {
        const cart = await findById (cid)
        if (!cart) {
            return res.status(400).json({ message: "Cart not found" });
        }
        res.status(200).json({ message: "Cart found", cart });
    } catch (error) {
        console.error(error)
        res.status(500).json({message: error})
    }
}

export const findAllC = async (req, res) => {
    try {
        const carts = await findAllCart();
        if (!carts || carts.length === 0) {
            return res.status(404).json({ message: "No carts found" });
        }
        res.status(200).json({ message: "Carts found", carts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
 
export const createOneCart = async (req, res) => {
    try {
        const cart = await createOne();
        res.status(201).json({ message: "Cart created", cart });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const addProductCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const product = await productService.findById(pid)
        const cartstatus = await findCartById(cid)
        if(product.stock >= cartstatus.product.quantity){
            const response = await addProductToCart(cid,pid);
            res.status(200).json({ message: "Product added to cart", cart: response });
        }else{
            res.status(404).json({ message: "Stock insuficiente" });
        }
               
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteOneProdCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const response = await deleteOne(cid,pid);
        res.status(200).json({ message: "Product delete to cart", cart: response });

    } catch (error){
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteOneCartAll = async (req, res) => {
    try {
        const { cid } = req.params;
        const response = await deleteAll(cid);
        res.status(200).json({ message: "Cart delete", cart: response });   
    } catch (error){
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateCartQuantity = async (req, res) => {
    const { pid , quantity } = req.body;
    const { cid } = req.params;
    try {
        const response = await updateCart(cid , pid , quantity);
        res.status(200).json({ message: "cart update", cart: response });
    } catch (error){
        res.status(500).json({ message: "Internal server error" });
    }
}

export const cartBuy = async (req,res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.findCartById(cid);
        const products = cart.products;
        let availableProducts = [];
        let unavailableProducts = [];
        let totalAmount = 0;
    
        for (let item of products) {
            if (item.product.stock >= item.quantity) {
                // Disponible
                availableProducts.push(item);
                item.product.stock -= item.quantity;
                await item.product.save();
                totalAmount += item.quantity * item.product.price;
            } else {
                //No disponible
                unavailableProducts.push(item);
            }
        }  
        cart.products = unavailableProducts;
        await cart.save();
        if (availableProducts.length) {
            const ticket = {
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: req.user.email,
            };
            await createOneTicket(ticket);
            return { availableProducts, totalAmount };
        }
        return { unavailableProducts };
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' }); 
    }};