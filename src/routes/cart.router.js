import { Router } from "express";
import { cartManager } from "../db/manager/cartsManager.js";

const router = Router();


router.get("/", async (req, res) => {

  try {
    const carts = await cartManager.findAllCart()
    res.status(200).json({ message: "carts total", carts });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:idCart", async (req, res) => {

  const { idCart } = req.params;

  try {
    const cart = await cartManager.findCartById(idCart);

    res.status(200).json({ message: "cart by id", cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/", async (req, res) => {

  try {
    const createCart = await cartManager.createOneCart();


    res.status(200).json({ message: "carrito creado", cart: createCart });


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:idCart/products/:idProduct", async (req, res) => {

  const { idCart, idProduct } = req.params;

  try {
    const productAdded = await cartManager.addProductToCart(idCart, idProduct);

    res.status(200).json({ message: "PRODUCTO AGREGADO", product: productAdded });


  } catch (error) {

    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/:idCart", async (req, res) => {

  const { idCart } = req.params;
  const { newProducts } = req.body;

  console.log(newProducts);

  try {
    const response = await cartManager.updateCart(idCart, newProducts);

    if (!response) {
      return res.status(404).json({ message: "cart not found" });
    }

    res.status(200).json({ message: "product update in cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/:idCart/products/:idProduct", async (req, res) => {

  const { idCart, idProduct } = req.params;
  const { quantity } = req.body;


  try {
    const response = await cartManager.addProductToCartQuantity(idCart, idProduct, quantity);

    if (!response) {
      return res.status(404).json({ message: "cart not found" });
    }

    res.status(200).json({ message: "quantity update in cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete("/:idCart", async (req, res) => {

  const { idCart } = req.params;

  try {
    const response = await cartManager.deleteTotalProductToCart(idCart);

    if (!response) {
      return res.status(404).json({ message: "cart not found" });
    }

    res.status(200).json({ message: "product total delete in cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:idCart/products/:idProduct", async (req, res) => {

  const { idCart, idProduct } = req.params;

  try {
    const response = await cartManager.deleteProductToCart(idCart, idProduct);

    if (!response) {
      return res.status(404).json({ message: "product not found" });
    }

    res.status(200).json({ message: "User update IN CADR" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;