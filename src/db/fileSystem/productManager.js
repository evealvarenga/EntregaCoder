import { promises, existsSync } from 'fs'

class ProductManager {
    constructor() {
        this.path = "src/products.json";
    }
    async getProduct() {
        try {
            if (fs.existsSync(this.path)) {
                const productsFile = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(productsFile);
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getProduct();
            let id;
            if (!products.length) {
                id = 1;
            } else {
                id = products[products.length - 1].id + 1;
            }
            const newProduct = { status: true, ...product, id };
            products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return newProduct;
        } catch (error) {
            return error;
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProduct();
            const productoFiltrado = products.find((item) => item.id === id);
            return productoFiltrado;
        } catch (error) {
            return error;
        }
    }

    async updateProduct(id, obj) {
        try {
            const products = await this.getProduct();
            const index = products.findIndex((item) => item.id === id);
            if (index === -1) {
                return null;
            }
            const updateProd = { ...products[index], ...obj };
            products.splice(index, 1, updateProd);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return updateProd;
        } catch (error) {
            return error;
        }
    }

    async deleteProductById(id) {
        try {
            const products = await this.getProduct();
            const productoFiltrado = products.find((item) => item.id === id);
            if (productoFiltrado) {
                const products2 = products.filter((item) => item.id != id);
                await fs.promises.writeFile(this.path, JSON.stringify(products2));
            }
            return productoFiltrado;
        } catch (error) {
            return error;
        }
    }

}

export default ProductManager;