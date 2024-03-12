import { findAllCart, findById, createOne, addProductToCart, deleteOne, deleteAll, updateCart, clearCart } from "../service/cart.service.js";
import { productService } from "../service/product.service.js";
import { cartManager } from "../DAL/daos/mongo/carts.dao.js";
import { createOneTicket } from "./ticket.controller.js";
import { v4 as uuidv4 } from "uuid";
import { CustomError } from "../errors/errors.generator.js";
import { errorsMessages } from "../errors/errors.enum.js";
import config from "../config/config.js"
import { findProductById } from "./products.controller.js";
import { logger } from "../utils/logger.js";
import { generateUniqueCode } from "../utils/utils.js";


export const findCartById = async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await findById(cid)
        if (!cart) {
            return CustomError.generateError(errorsMessages.CART_NOT_FOUND, 404)
        }
        res.status(200).json({ message: "Cart found", cart });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error })
    }
}

export const findAllC = async (req, res) => {
    try {
        const carts = await findAllCart();
        if (!carts || carts.length === 0) {
            return CustomError.generateError(errorsMessages.CART_NOT_FOUND, 404)
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
    const quantity = 1
    try {
        const cartstatus = await findById(cid)
        if (!cartstatus) {
            return CustomError.generateError(errorsMessages.CART_NOT_FOUND, 404)
        }
        if ((await req.user.role) === "PREMIUM" || (await req.user.role) === "ADMIN") {
            const product = await productService.findById(pid)
            if (product.owner === (await req.user.email)) {
                return res.status(404).json({ message: "No puedes agregar tus propios productos." });
            }
            if (product.stock >= quantity) {
                const subtotal = product.price + cartstatus.subtotal
                const stotal = await cartManager.updateTotal(cid, subtotal)
                const response = await addProductToCart(cid, pid);
                res.status(200).json({ message: "Product added to cart", cart: response });
            } else {
                res.status(500).json({ message: "Item no disponible en stock" });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteOneProdCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cartStatus = findById(cid)
        if (!cartStatus) {
            return CustomError.generateError(errorsMessages.CART_NOT_FOUND, 404)
        }
        const response = await deleteOne(cid, pid);
        res.status(200).json({ message: "Product delete from cart", cart: response });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteOneCartAll = async (req, res) => {
    const { cid } = req.params;
    try {
        const response = await deleteAll(cid);
        res.status(200).json({ message: "Cart delete", cart: response });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateCartQuantity = async (req, res) => {
    const { pid, quantity } = req.body;
    const { cid } = req.params;
    try {
        //Validaciones
        const cartVali = await findById(cid)
        const prodVali = await findProductById(pid)
        if (!cartVali) {
            return CustomError.generateError(errorsMessages.CART_NOT_FOUND, 404)
        }
        if (!prodVali) {
            return CustomError.generateError(errorsMessages.PRODUCT_NOT_FOUND, 404)
        }
        //Agregado
        const response = await updateCart(cid, pid, quantity);
        res.status(200).json({ message: "cart update", cart: response });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const cartBuy = async (cid, email) => {
    try {
        const cart = await findById(cid);
        const products = cart.products;
        let disponibles = [];
        let noDisponibles = [];
        for (let item of products) {
            const pid = item.product._id
            const product = await productService.findById(pid)
            if (product.stock >= item.quantity) {
                // Disponible
                disponibles.push(item);
                const newStock = product.stock -= item.quantity
                const obj = { stock: newStock }
                await productService.updateProduct(pid,obj)
            } else {
                //No disponible
                noDisponibles.push(item);
            }
        }

        logger.info("Productos disponibles", disponibles, "Productos no disponibles", noDisponibles);
        const total = cart.subtotal
        if (disponibles.length) {
            const ticket = {
                code: generateUniqueCode(),
                purchase_datatime: new Date(),
                amount: total,
                purchaser: email,
            };
            logger.info("Ticket", ticket);
            const finalTicket = await createOneTicket(ticket);
            await clearCart(cart)
            return { disponibles, total, finalTicket };
        }
        return { noDisponibles };
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const updateCartC = async (req, res) => {
    const { cid } = req.params;
    const { pid } = req.body;
    try {
        const cart = await findById(cid)
        if (!cart) {
            return CustomError.generateError(errorsMessages.CART_NOT_FOUND, 404)
        }
        const updatedCart = await updateCart(cid, pid);
        res.status(200).json({ message: "Updated succesfull" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}