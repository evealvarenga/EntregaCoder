import { productsModel } from '../db/models/products.model.js'

class ProductManager {

    async addProduct(product) {
        const result = await productsModel.create(product);
        return result;
    }

    async getProducts() {
        const result = await productsModel.find().lean();
        return result;
    }

    async getProductsByID(id) {
        const result = await productsModel.findById(id);
        return result;
    }

    async updateProduct(id, updatedProduct) {
        const result = await productsModel.updateOne({__id: id}, updatedProduct);
        return result;
    }

    async deleteProduct(id) {
        const result = await productsModel.deleteOne(id);
        return result;
    }

}

export default ProductManager;