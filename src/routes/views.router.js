import { Router } from "express";
import { productManager } from "../DAL/daos/mongo/products.dao.js";
import { cartManager } from "../DAL/daos/mongo/carts.dao.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { logger } from "../logger.js";

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


router.get("/chat", authMiddleware(["USER"]), async (req, res) => {
  res.render("chat");
});


router.get("/products", async (req, res) => {
  if (!req.session.passport) {
    return res.redirect("/api/views/login")
  }
  let products = await productManager.findAll(req.query)
  let productsDB = products.payload
  const productsObject = productsDB.map(p => p.toObject());
  let { name, cart } = await req.user
  res.render("products", {
    productsData: productsObject,
    user: { name, cart },
  });
});

router.get("/carts/:cartId", async (req, res) => {
  const { cartId } = req.params
  try {
    let cart = await cartManager.findCartById(cartId);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado')
    }
    let cartArray = cart.products;
    const cartArrayObject = cartArray.map(doc => doc.toObject());
    let { name } = await req.user
    res.render("cart", {
      cartData: cartArrayObject,
      user: { name },
    });
  } catch (error) {
    res.status(500).send('Error interno')
  }
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
  if (!req.session.passport) {
    return res.redirect("api/views/login");
  }
  const { name, email, role } = await req.user;
  res.render("profile", { user: { name, email, role } });
});

router.get("/error", async (req, res) => {
  res.render("error")
});

router.get("/restaurar", (req, res) => {
  res.render("restaurar");
})

router.get("/loggerTest", async (req, res) => {
  logger.error("PROBANDO LOGGER ERROR")
  logger.fatal("PROBANDO LOGGER FATAL")
  logger.warning("PROBANDO LOGGER WARNING")
  logger.http("PROBANDO LOGGER HTTP")
  logger.debug("PROBANDO LOGGER DEBUG")
  logger.info("PROBANDO LOGGER INFO")

  res.render("logger")
})

export default router;
