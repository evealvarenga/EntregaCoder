import { Router } from "express";
import { usersManager } from "../db/manager/usersManager.js";

const router = Router();


router.post("/signup", async (req, res) => {
  const { name, last_name, email, password } = req.body
  if (!email || !password || !name || !last_name) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  try {
    const createUser = await usersManager.createOne(req.body);
    res.redirect("/api/views/products")
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  try {
    const user = await usersManager.findByEmail(email);
    if (!user) {
      return res.redirect("/api/views/signup")
    }
    const passwordVald = user.password === password;
    if (!passwordVald) {
      return res.status(404).json({ message: "Clave incorrecta" });
    }
    let correoAdmin = "adminCoder@coder.com";
    let claveAdmin = "adminCod3r123";
    if (password === claveAdmin && email === correoAdmin) {
      req.session.user = { email, name: user.name, isAdmin: true };
    } else {
      req.session.user = { email, name: user.name, isAdmin: false };
    };
    res.redirect("/api/views/products")
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/signout", async (req, res) => {
  req.session.destroy(() => { res.redirect("/api/views/login") })
});

export default router;
