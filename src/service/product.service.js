import { productManager } from "../DAL/daos/mongo/products.dao.js";

class ProductService{
    async findAll(){
        let products = await productManager.findAll(req.query)
        let productsDB = products.payload
        const productsObject = productsDB.map(p => p.toObject());
        return productsObject
        /*res.render("products", {
            productsData: productsObject
          });
        return productManager.findAll();*/
    }

    async findById(id){
        return productManager.findById(id);
    }

    async createOne(obj){
        return productManager.createOne(obj);
    }

    async deleteOneProduct(pid){
        return productManager.deleteOne(pid);
    }

    async updateProduct(pid, obj){
        return productManager.updateOne(pid, obj);
    }
}

export const productService = new ProductService()