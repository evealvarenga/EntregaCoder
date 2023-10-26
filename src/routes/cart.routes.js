import { Router } from "express";
import CartManager from '../manager/CartManager.js';

const manager = new CartManager();
const router = Router();


//Endpoint para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const cart = await manager.addCart();
        return res.status(200).json({message: "Carrito creado.", cart});
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener los productos del carrito.' });
    }
});
 
//Endpoint para obtener productos del carrito
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await manager.getCartByID(+cid);
        if (!cart) {
            return res.status(404).json({message: "Carrito no encontrado."});
        } 
        return res.status(200).json({message: "Carrito encontrado.", cart});
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener los productos del carrito.' });
    }
});
 
//Endpoint para agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const response = await manager.addProductToCart(req.params, req.body);
        res.status(200).json({message:"Productos agregados al carrito", Carrito: response})
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al agregar el producto al carrito.' });
    }
});


export default router;
