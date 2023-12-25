import { productService } from "../service/product.service.js";

export const findProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productService.findById(pid);
        if (!product) {
            return res
            .status(404)
            .json({ message: "Product not found with the id provided" });
        }
        res.status(200).json({ message: "Product found", product });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
};

export const findAllProduct = async (req, res) => {
    try {
        const products = await productService.findAll(req.query); 
        res.status(200).json({ message: "Product found", products });   
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createOneProduc = async (req, res) => {
    const { title, description, price, code, stock, category } = req.body;
    if (!title || !description || !price || !code || !stock || ! category) {
        return res.status(400).json({ message: "Some data is missing" });
    }
    try {
        const response = await productService.createOne(req.body);
        res.status(200).json({ message: "Producto created", response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteOneProdAll = async (req, res) => {
    const { pid } = req.params;
    try {
        const response = await productService.deleteOneProduct(pid);
        if (!response) {
            return res
            .status(404)
            .json({ message: "Product not found with the id provided" });
        }
        res.status(200).json({ message: "Product deleted" });
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
}

export const updateProducts = async (req, res) => {
    const { pid } = req.params;
    try {
        const response = await productService.updateProduct(pid, req.body);
        if (!response) {
            return res
            .status(404)
            .json({ message: "Product not found with the id provided" });
        }
        res.status(200).json({ message: "Product updated", response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}