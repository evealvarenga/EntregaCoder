import { Router } from "express";
import ProductManager from '../manager/ProductManager.js';

const router = Router()
const manager = new ProductManager('./src/productos.json');

router.get("/", async (req, res) => {
    try {
        const products = await manager.getProducts(req.query);
        res.render("home", {response: products});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await manager.getProducts(req.query);
        res.render("realTimeProducts", {response: products});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
