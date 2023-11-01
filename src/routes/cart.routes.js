import { Router } from "express";
import { cartManager } from "../manager/CartManager.js";

const router = Router();

router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.addCart();
        return res.status(200).json({cart});
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener los productos del carrito.' });
    }
});
 

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartByID(+cid);
        if (!cart) {
            return res.status(404).json({message: "Carrito no encontrado."});
        } 
        return res.status(200).json({message: "Carrito encontrado.", cart});
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener los productos del carrito.' });
    }
});
 

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const response = await cartManager.addProductToCart(cid, pid);
        res.status(200).json({message:"Productos agregados al carrito", Carrito: response})
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al agregar el producto al carrito.' });
    }
});


export default router;
