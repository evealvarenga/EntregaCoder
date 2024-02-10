import { productManager } from "../src/DAL/daos/mongo/products.dao.js";
import { expect } from "chai"
import mongoose from "mongoose";
import "./bd.js"

describe("Get all products", function(){
    it('should return an array', async function(){
        const limit = 20;
        const result = await productManager.findAll({limit})
        expect(result.docs).to.be.an("array")
    })
})

describe("Create one product", function (){

    after(function() {
        mongoose.connection.collections.products.drop();
    });
    const productMock1 = {
        title: "Celular prueba 1",
        description: "Celular en venta",
        price: "350",
        stock: "199",
        code: "2718"
    }
    const productMock2 = {
        title: "Celular prueba 2",
        description: "Celular en venta",
        price: "350",
        stock: "199",
        code: "2718"
    }
    const productMock3 = {
        title: "Celular prueba 3",
        description: "Celular en venta",
        price: "350",
        stock: "199",
        code: "2718",
        owner: "ADMIN"
    }
    it("Successful", async function(){
        const response = await productManager.createOne(productMock1);
        expect(response).to.have.property("owner")
    })
    it("Should throw an error if a required property in missing", async function(){
        try {
            await productManager.createOne(productMock2);
        } catch (error) {
            expect(error).to.be.an("error");
        }
    })
})
describe("Find Products", function() {
    const productMock1 = {
        title: "Celular prueba 1",
        description: "Celular en venta",
        price: "350",
        stock: "199",
        code: "2718"
    }
    const productMock2 = {
        title: "Celular prueba 2",
        description: "Celular en venta",
        price: "350",
        stock: "199",
        code: "2718"
    }
    it("Find product by owner", async function(){
        const product1 = await productManager.createOne(productMock1);
        const product2 = await productManager.createOne(productMock2);
        expect(response).to.have.lengthOf(1)
    })
})
