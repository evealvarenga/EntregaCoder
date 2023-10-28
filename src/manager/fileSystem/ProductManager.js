import { promises, existsSync } from 'fs'

class ProductManager {
    constructor(path) {
        this.path = path
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts()
            let id
            if (!products.length) {
                id = 1
            } else {
                id = products[products.length - 1].id + 1
            }
            const newProduct = { id, status:true, ...product };
            products.push(newProduct);
            await promises.writeFile(this.path, JSON.stringify(products))
            return newProduct
        } catch (error) {
            return error
        }
    }

    async getProducts(queryObj) {
        const { limit } = queryObj;
        try {
            if (existsSync(this.path)) {
                const productFile = await promises.readFile(this.path, 'utf-8')
                const productData = JSON.parse(productFile);
                return limit ? productData.slice(0, +limit) : productData;
            } else {
                return []
            }
        } catch (error) {
            return error
        }
    }

    async getProductsByID(id) {
        try {
            const products = await this.getProducts()
            const product = products.find(u => u.id === id)
            return product;
        } catch (error) {
            return error
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const products = await this.getProducts({});
            const productIndex = products.findIndex(u => u.id === id);

            if (productIndex === -1) {
                return null;
            }
            const uProduct = { ...products[productIndex], ...updatedProduct};
            products.splice(index, 1, uProduct);
            await promises.writeFile(this.path, JSON.stringify(products));
            return uProduct;
        } catch (error) {
            return error;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts()
            const product = products.find(p => u.id ===id);
            if(user){
                const newArrayProducts = products.filter(u => u.id !== id)
                await promises.writeFile(this.path, JSON.stringify(newArrayProducts))
            }
            return user;
        } catch (error) {
            return error
        }
    }

}

export default ProductManager;