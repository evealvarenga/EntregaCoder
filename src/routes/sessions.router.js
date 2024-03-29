import { Router } from "express";
import { usersManager } from "../DAL/daos/mongo/users.dao.js";
import { UsersService } from "../service/users.service.js";
import { hashData, generateToken, compareData } from "../utils/utils.js";
import { tokenValidation, tokenMiddleware } from "../middlewares/jwt.middleware.js";
import { transporter } from "../utils/nodemailer.js"
import { CustomError } from "../errors/errors.generator.js";
import { errorsMessages } from "../errors/errors.enum.js";
import config from "../config/config.js"
import passport from "passport";
import jwt from 'jsonwebtoken';
import { loggers } from "winston";

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
    const user = await usersManager.findByEmail(email)
    if (user) {
      return res.redirect("/api/views/login")
    }
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

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/views/error" }), tokenMiddleware, (req, res) => { res.redirect("/api/views/products") });

router.get("/signout", tokenValidation, async (req, res) => {
  const { _id } = await req.user
  const lasco = new Date()
  UsersService.updateUser(_id, { last_connection: lasco });
  req.session.destroy(() => { res.redirect("/api/views/login") })
});

router.post("/restaurar", async (req, res) => {
  const { email, password, token } = req.body
  //Verificación datos completos
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    //Verificación de usuario existente
    const user = await usersManager.findByEmail(email);
    if (user === null) {
      return res.redirect("/api/views/signup");
    }

    // Verificación de contraseña existente
    const samePass = await compareData(password, user.password);
    if (samePass) {
      return res.status(404).json({ error: 'No puedes ingresar una contraseña ya utilizada.' });
    }
    const deco = jwt.verify(token, SECRET_KEY_JWT);
    const timestamp = deco.iat;
    const currentTime = Math.floor(Date.now() / 1000);

    //Verificación tiempo token
    if ((currentTime - timestamp) >= 3600) {
      return res.status(403).json({ error: 'El enlace ha caducado.' });
    }

    //Todo ok
    const hashedPassword = await hashData(password);
    user.password = hashedPassword;
    await user.save();
    res.redirect("/api/views/login");
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error interno en el servidor.' });
  }
});

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
    const token = generateToken({ email })
    res.cookie('token', token, { maxAge: 3600000, httpOnly: true })

    await transporter.sendMail({
      from: "Entrega Coderhouse - Alvarenga",
      to: email,
      subject: "Recuperacion de contraseña",
      html: `<b>Por favor haga clic en el siguiente link para restablecer su contraseña </br></br>
          <a href="http://localhost:8080/api/views/restaurar?token=${token}" class="sessionButton">
            <button class="btn btn-outline-warning" type="button" data-bs-toggle="offcanvas" data-bs-target="#Side_carrito"
            aria-controls="offcanvasRight">Restaurar contraseña</button>
          </a>
       </b>`,
    });

    res.status(200).json({ success: 'Mail enviado con éxito' });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ error: 'Hubo un error interno en el servidor.' });
  }
})


export default router;
