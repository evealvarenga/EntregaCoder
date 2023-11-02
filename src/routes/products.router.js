import { Router } from "express";
import { productManager } from "../manager/ProductManager.js"

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.findAll(req.query);
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al obtener los productos.' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.findById(+pid);
        return res.status(200).json({message: "Producto encontrado.", product});
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener el producto.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const response = await productManager.createOne(req.body);
        res.status(200).json({message:"Producto creado", product: response})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

router.put('/:pid', async (req, res) => {
    
    try {
        const { pid } = req.params;
        const response = await productManager.updateProduct(+pid, req.body);
        res.status(200).json ({message:"Producto modificado."})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});


router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        await productManager.deleteOne(+pid);
        res.status(200).json({message: "Producto eliminado"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}); 

export default router;