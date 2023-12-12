import { Router } from "express";
import { usersManager } from "../daos/usersManager.js";
import { hashData, generateToken } from "../utils.js";
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

router.post("/signup",
  passport.authenticate("signup",
    { failureRedirect: "/api/views/error" }),
  async (req, res) => {
    const { email, name, last_name } = req.user
    const token = generateToken({
      name,
      last_name,
      email
    }); 
    res.cookie("token", token, { maxAge: 60000, httpOnly: true })
    const admin = email === "adminCoder@coder.com" ? true : false
    req.session.user = { email, name, last_name, cart: null, admin }
    res.redirect("/api/views/products")
  });
 
router.post("/login",
  passport.authenticate("login",
    {
      failureRedirect: "/api/views/error"
    }), (req, res) => {
      const {name, last_name, email} = req.user
      const token = generateToken({
        name,
        last_name,
        email
      }); 
      res.cookie("token", token, { maxAge: 60000, httpOnly: true })
      return res.redirect("/api/sessions/current")
    });

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

router.get("/auth/github", passport.authenticate("github", { scope: ['user:email'] }))

router.get("/callback",
  passport.authenticate("github",
    { failureRedirect: "/api/views/error" }),
  async (req, res) => {
    const { email, name, last_name } = req.user
    const admin = email === "adminCoder@coder.com" ? true : false
    req.session.user = { email, name, last_name, cart: null, admin }
    res.redirect("/api/views/products")
  });

router.get("/current", passport.authenticate("current", { session: false }), (req, res) => {
  const user = req.user
  res.json({ message: user })
});


export default router;
