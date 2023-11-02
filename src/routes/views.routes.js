import { Router } from "express";
import { cartManager } from "../manager/CartManager.js";
import { productManager } from "../manager/ProductManager.js";

const router = Router()

router.get("/", async (req, res) => {
    res.render("websocket")

});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts");
});

router.get("/chat", (req, res) => {
    res.render("chat");
});

router.get("/home", (req, res) => {
    res.render("home");
});

router.get("/products", async (req, res) => {
    try {
        const products = await productManager.findAll({ limit: 10, page: 1, sort: {}, query: {} }).lean()
        const docs = products.payload.docs
        res.render("products", { products: docs });
    } catch (error) {
        return error
    }
});

router.get("/carts/:cid", async(req,res)=>{
    try {
      const {cid} = req.params
      const cart = await cartManager.getCartByID(cid)
      const products = cart.products
      res.render("cart",{products})
      console.log(products)
    } catch (error) {
      return error
    }
  })

export default router;
