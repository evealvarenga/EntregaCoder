import { Router } from "express";
import ProductManager from '../manager/ProductManager.js';

const router = Router();
const manager = new ProductManager('./src/productos.json');

// Endpoint para obtener productos
router.get('/', async (req, res) => {
    try {
        const products = await manager.getProducts(req.query);
        if (!products.length){
            res.status(200).json({ message: "No hay productos guardados." });
        }
        res.status(200).json({ message: "Productos encontrados", products });
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al obtener los productos.' });
    }
});


// Endpoint para obtener un producto por ID
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await manager.getProductsByID(+pid);
        if (!product) {
            return res.status(404).json({message: "Producto no encontrado."});
        } 
        return res.status(200).json({message: "Producto encontrado.", product});
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener el producto.' });
    }
});

//Endpoint para agregar un nuevo producto
router.post('/', async (req, res) => {
    const { tittle, description, code, price, status, stock, category, thumbnails} =req.body
    if (!tittle || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).json({message: "Some data is missing."})
    }
    try {
        const response = await manager.addProduct(req.body);
        res.status(200).json({message:"Producto creado", product: response})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

//Endpoint para actualizar un producto
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const response = await manager.updateProduct(+pid, req.body);
        if(!response) {
            return res.status(404).json({message:"Producto no encontrado con el ID indicado."})
        }
        res.status(200).json ({message:"Producto modificado."})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

//Endpoint para eliminar un producto
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const response = await manager.deleteProduct(+pid);
        if (!response) {
            return res.status(404).json({message: "Producto no encontrado con el ID indicado."})
        }
        res.status(200).json({message: "Producto eliminado"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}); 

export default router;