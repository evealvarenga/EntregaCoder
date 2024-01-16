import { Router } from "express";
import { findProductById, findAllProduct, createOneProduc, deleteOneProdAll, updateProducts, productMocksController } from "../controllers/products.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

//import { productManager } from "../db/manager/productManager.js";

const router = Router();

router.get("/", findAllProduct)
router.get("/:pid", findProductById)
router.post("/", authMiddleware(["ADMIN"]), createOneProduc)
router.delete("/:pid", authMiddleware(["ADMIN"]), deleteOneProdAll)
router.put("/:pid", authMiddleware(["ADMIN"]), updateProducts)
router.get("/mock/mockingproducts", productMocksController)

/*
router.get("/", async (req, res) => {
  if (!req.session.user) {
  return res.redirect("/api/views/login")}
  let products = await productManager.findAll(req.query)
  let productsDB = products.payload
  const productsObject = productsDB.map(p => p.toObject());
  res.render("products", {
    productsData: productsObject,
    user: req.session.user
  });
});


router.get("/:pid", async (req, res) => {

  const { pid } = req.params;

  try {
    let productoFiltrado = await productManager.findById(pid);

    if (!productoFiltrado) {
      res.status(404).json({ message: "product not found" });
    } else {
      res.status(200).json({ message: "product found", productoFiltrado });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {

  try {
    const createProduct = await productManager.createOne(req.body);
    res.status(200).json({ message: "product creado", product: createProduct });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/:pid", async (req, res) => {

  const { pid } = req.params;

  try {
    const response = await productManager.updateOne(pid, req.body);

    if (!response) {
      return res.status(404).json({ message: "product not found" });
    }

    res.status(200).json({ message: "User update" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {

  const { pid } = req.params;

  try {
    let response = await productManager.deleteOne(pid);

    if (!response) {
      return res.status(404).json({ message: "product not found" });
    }

    res.status(200).json({ message: "User delete" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});*/

export default router;
