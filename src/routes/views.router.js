import { Router } from "express";
import { productManager } from "../DAL/daos/mongo/products.dao.js";
import { cartManager } from "../DAL/daos/mongo/carts.dao.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { logger } from "../utils/logger.js";

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
  const {name, cart} = await req.user
  try {
    const cartID = await cartManager.findCartById(cart);
    if (!cartID) {
      return res.status(404).send('Carrito no encontrado')
    }
    const cartSubtotal = cartID.subtotal
    const cartArray = cartID.products.map(doc => doc.toObject());
    res.render('cart', {  user: { name }, cart : cart, subtotal:cartSubtotal, products:cartArray })
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

router.get("/documents", async (req, res) => {
  if (!req.session.passport) {
    return res.redirect("api/views/login");
  }
  const { name, email, _id } = await req.user;
  res.render("documents", { user: { name, email, _id } });
});


router.get("/error", async (req, res) => {
  res.render("error")
});

router.get("/restaurar", (req, res) => {
  const { token } = req.query;
  res.render("restaurar", { token: token });
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

router.get("/recoverMail", async (req, res) => {
  res.render("recover")
});

router.get("/premium", async (req, res) => {
  const { name, role, _id } = await req.user;
  res.render("premium", { user: { name, role, _id } });
})

router.get("/createProduct", authMiddleware(["ADMIN", "PREMIUM"]), async (req, res) => {
  const { name, role, _id } = await req.user;
  res.render("createProducts", { user: { name, role, _id } });
})

router.get("/product/:pid", async (req, res) => {
  const { pid } = req.params;
  const { name, cart } = await req.user;
  try {
    const product = await productManager.getById(pid);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    const clonedProduct = Object.assign({}, product);
    res.render("product", {
      product: clonedProduct,
      user: { name, cart },
    });
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
})


export default router;