import { productService } from "../service/product.service.js";
import { productMock } from "../mock/productMock.js";
import { CustomError } from "../errors/errors.generator.js";
import { errorsMessages } from "../errors/errors.enum.js";

export const findProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productService.findById(pid);
        if (!product) {
            return CustomError.generateError(errorsMessages.PRODUCT_NOT_FOUND, 404)
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
    if (!title || !description || !price || !code || !stock || !category) {
        return CustomError.generateError(errorsMessages.ALL_FIELDS, 404)
    }
    try {
        if (req.user.role === "PREMIUM") {
            const producto = { ...req.body, owner: req.user.email };
            const response = await productService.createOne(producto);
            res.status(200).json({ message: "Producto creado", response });

        } else {
            const response = await productService.createOne(req.body);
            res.status(200).json({ message: "Producto creado", response });

        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteOneProdAll = async (req, res) => {
    const { pid } = req.params;
    const pDelet = await productService.findById(pid)
    try {
        if (req.user.role === "PREMIUM") {
            if (pDelet.owner === req.user._id) {
                const response = await productService.deleteOneProduct(pid);
                if (!response) {
                    return CustomError.generateError(errorsMessages.PRODUCT_NOT_FOUND, 404)
                }
                res.status(200).json({ message: "Product deleted" });
            }
        } else {
            return res.status(500).json({message: "Producto creado por otro usuario."})
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateProducts = async (req, res) => {
    const { pid } = req.params;
    try {
        const response = await productService.updateProduct(pid, req.body);
        if (!response) {
            return CustomError.generateError(errorsMessages.PRODUCT_NOT_FOUND, 404)
        }
        res.status(200).json({ message: "Product updated", response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const productMocksController = async (req, res, next) => {
    try {
        const mockData = productMock();

        res.status(200).json({ message: "Product created successfully", mockData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}