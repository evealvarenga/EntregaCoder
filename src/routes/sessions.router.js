import { Router } from "express";
import { usersManager } from "../db/manager/usersManager.js";
import { hashData } from "../utils.js";
import passport from "passport";

const router = Router();

/*
router.post("/signup", async (req, res) => {
  const { name, last_name, email, password } = req.body
  if (!email || !password || !name || !last_name) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  try {
    const hashPassword = await hashData(password);
    const createUser = await usersManager.createOne({ ...req.body, password: hashPassword});
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
    const passwordVald = await compareData(password, user.password)
    if (!passwordVald) {
      return res.status(404).json({ message: "Contraseña incorrecta" });
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
});*/

router.post("/signup", passport.authenticate("singup", { successRedirect: "/api/views/profile", failureRedirect: "/api/views/error" }))

router.post("/login", passport.authenticate("login", { successRedirect: "/api/views/profile", failureRedirect: "/api/views/error" }));

router.get("/signout", async (req, res) => {
  req.session.destroy(() => { res.redirect("/api/views/login") })
});

router.post("/restaurar", async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await usersManager.findByEmail(email);
    if (!user) {
      return res.redirect("/api/views/login")
    }
    const hashPassword = await hashData(password)
    user.password = hashPassword;
    await user.save()
    res.status(200).json({ message: "User update" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

router.get("/auth/github",passport.authenticate("github", { scope: ["user:email"] }))

router.get("/callback", passport.authenticate("github", { successRedirect: "/api/views/profile", failureRedirect: "/api/views/error" }));

export default router;
