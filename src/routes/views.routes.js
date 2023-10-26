import { Router } from "express";
import ProductManager from '../manager/ProductManager.js';

const router = Router()
const manager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const products = await manager.getProducts();
        res.render("home", {response: products});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await manager.getProducts();
        res.render("realTimeProducts", {response: products});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/chat", (req, res) => {
    res.render("chat");
  });

export default router;
