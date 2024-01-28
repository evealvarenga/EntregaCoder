import { Router } from "express";
import { usersManager } from "../DAL/daos/mongo/users.dao.js";
import { hashData, generateToken } from "../utils/utils.js";
import { transporter } from "../utils/nodemailer.js"
import config from "../config/config.js"
import passport from "passport";
import jwt from 'jsonwebtoken';

const SECRET_KEY_JWT = config.secret_jwt

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
    const role = email === "adminCoder@coder.com" ? "ADMIN" : "USER"
    req.session.user = { email, name, last_name, cart: null, role }
    res.redirect("/api/views/products")
  });

router.post("/login",
  passport.authenticate("login",
    { failureRedirect: "/api/views/error" }),
  (req, res) => {
    const { name, last_name, email } = req.user
    const token = generateToken({
      name,
      last_name,
      email
    });
    res.cookie("token", token, { maxAge: 60000, httpOnly: true })
    res.redirect("/api/views/products")
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

router.post("/recover", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await usersManager.findByEmail(email);
    if (!user) {
      return res.redirect("/api/session/signup");
    }
    const token = jwt.sign({ email }, SECRET_KEY_JWT, { expiresIn: '1h' }); 

    await transporter.sendMail({
      from: "ealvarenga095@gmail.com",
      to: email,
      subject: "Recuperacion de contraseña",
      html: `<b>Por favor haga clic en el siguiente link para restablecer su contraseña http://localhost:8080/api/views/restaurar?token=${token} </b>`,
    });

    res.status(200).json({ success: 'Mail enviado con éxito' });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ error: 'Hubo un error interno en el servidor.' });
  }
  /*const { email} = req.body
  const mailOptions = {
    from: "Lyn",
    to: email,
    subject: "Recupero de contraseña",
    html: "<h1>prueba</h1>"
  }
  console.log(mailOptions);
  await transporter.sendMail(mailOptions)
  res.send("Mail enviado");*/

})


export default router;
