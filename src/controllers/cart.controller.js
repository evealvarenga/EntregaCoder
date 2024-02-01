import { findAllCart, findById, createOne, addProductToCart, deleteOne, deleteAll, updateCart } from "../service/cart.service.js";
import { productService } from "../service/product.service.js";
import { cartManager } from "../DAL/daos/mongo/carts.dao.js";
import { createOneTicket } from "./ticket.controller.js";
import { v4 as uuidv4 } from "uuid";
import { CustomError } from "../errors/errors.generator.js";
import { errorsMessages } from "../errors/errors.enum.js";
import config from "../config/config.js"

export const findCartById = async (req,res) => {
    const { cid } = req.params
    try {
        const cart = await findById (cid)
        if (!cart) {
            //return res.status(400).json({ message: "Cart not found" });
            return CustomError.generateError(errorsMessages.CART_NOT_FOUND,404)
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
            //return res.status(404).json({ message: "No carts found" });
            return CustomError.generateError(errorsMessages.CART_NOT_FOUND,404)
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
        if (product.owner === req.user.email) {
            return res.status(404).json({ message: "No puedes agregar tus propios productos." });
        } else {
            if(product.stock >= cartstatus.product.quantity){
                const response = await addProductToCart(cid,pid);
                res.status(200).json({ message: "Product added to cart", cart: response });
            }else{
                res.status(404).json({ message: "Stock insuficiente" });
            }
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
        res.status(200).json({ message: "Product delete from cart", cart: response });

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
        const secret_jwt = config.secret_jwt
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
        logger.info("Productos disponibles", availableProducts, "Productos no disponibles", unavailableProducts);
        cart.products = unavailableProducts;
        await cart.save();
        const token = req.cookie.token
        const userToken = jwt.verify(token, secret_jwt);
        logger.info("userticket", userToken);
        if (availableProducts.length) {
            const ticket = {
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: userToken.email,
            };
            logger.info("ticket", ticket);
            const finalTicket = await createOneTicket(ticket);
            return { availableProducts, totalAmount, finalTicket };
        }
        return { unavailableProducts };
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Error interno del servidor' }); 
    }};