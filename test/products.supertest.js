import supertest from "supertest";
import { expect } from "chai";
const requester = supertest("http://localhost:8080");

const user = {
    email: 'p@prueba.com',
    password: '1234',
};
let cookieData;

describe("Endpoints", () => {
    before(async () => {
        const response = await requester.post("/api/session/login").send(user);
        const cookie = response.headers["set-cookie"][1];
        cookieData = {
            name: cookie.split("=")[0],
            value: cookie.split("=")[1].split(";")[0]
        };
    });
    describe("POST '/api/products'", () => {
        it("Endpoint POST /api/products create product", async () => {
            const product1 = {
                title: "Celular prueba",
                description: "Celular en venta",
                price: "350",
                stock: "199",
                code: "2718",
                owner: "ADMIN"
            };
            const response = await requester.post("/api/products").set("Cookie", [`${cookieData.name}=${cookieData.value}`]).send(product1);
            expect(response.status).to.equal(200);
        });
        it("Endpoint PUT /api/products update product", async () => {
            const product1 = {
                title: "Celular prueba",
                description: "Celular en venta",
                price: "350",
                stock: "199",
                code: "2718",
                owner: "ADMIN"
            };
            const response = await requester.put("/api/products/65c40a5a0666f1324d771038")
                .set("Cookie", [`${cookieData.name}=${cookieData.value}`])
                .send(product1);
            expect(response.status).to.equal(200);
        });
    });
    describe("GET '/api/products'", async () => {
        it("should return all products", async () => {
            const opt = {
                limit: 0,
                page: 1,
                orders: 0
            };
            const response = await requester.get("/api/products").query(opt);
            expect(response._body.products.docs).to.be.an("array");
        });

        it("should return one product by ID", async () => {
            const response = await requester.get(`/api/products/6536fde93a1ffc43d021abe0`);
            expect(response._body.message).to.be.equal("Product found");
        });
    });
});