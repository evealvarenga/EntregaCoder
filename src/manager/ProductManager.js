import { productsModel } from '../db/models/products.model.js'

class ProductManager {

    async createOne(product) {
        const result = await productsModel.create(product);
        return result;
    }

    async findAll() {
        const result = await productsModel.find().lean();
        return result;
    }

    async findById(id) {
        const result = await productsModel.findById(id);
        return result;
    }

    async updateOne(id, updatedProduct) {
        const result = await productsModel.updateOne({__id: id}, updatedProduct);
        return result;
    }

    async deleteOne(id) {
        const result = await productsModel.deleteOne(id);
        return result;
    }

}

export const productManager = new ProductManager();