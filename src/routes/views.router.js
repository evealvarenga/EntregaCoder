import { Router } from "express";
import { productManager } from "../db/manager/productManager.js";
import { cartManager } from "../db/manager/cartsManager.js";

const router = Router();

router.get("/", async (req, res) => {
  let products = await productManager.findAll(req.query)
  let productsDB = products.payload
  const productsObject = productsDB.map(p => p.toObject());
  res.render("products", {
    productsData: productsObject,
    user: req.session.user
  });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});


router.get("/chat", async (req, res) => {
  res.render("chat");
});


router.get("/products", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/api/views/login")
  }
  let products = await productManager.findAll(req.query)
  let productsDB = products.payload
  const productsObject = productsDB.map(p => p.toObject());
  res.render("products", {
    productsData: productsObject,
    user: req.session.user
  });


});

router.get("/carts/:cartId", async (req, res) => {
  const {cartId} = req.params
  let cartById = await cartManager.findCartById(cartId);
    let cartArray=   cartById.products;
  const cartArrayObject = cartArray.map(doc => doc.toObject());
  console.log(cartArrayObject);
  res.render("cart", {
    cartData: cartArrayObject
  });
});

router.get("/login", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/api/views/products")
  }
  res.render("login")
});


router.get("/signup", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/api/views/products")
  }
  res.render("signup")
});

router.get("/profile", async (req, res) => {
  res.render("profile")
});

export default router;
