import express from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils/utils.js";
import { Server } from "socket.io";
import MongoStore  from "connect-mongo";
import cookieParser  from "cookie-parser";
import session from "express-session";
import "./config/configDB.js"
import passport from "passport";
import "./config/passport.js"
import config from "./config/config.js"
import { errorMiddleware } from "./middlewares/errors.middleware.js";
import { logger } from "./utils/logger.js";

//Swagger
import { swaggerSetup } from "./utils/swagger.js";
import swaggerUi from "swagger-ui-express"

//Import Routers
import routerProduct from "./routes/products.router.js";
import routerCart from "./routes/cart.router.js";
import routerSessions from "./routes/sessions.router.js";
import routerViews from "./routes/views.router.js";
import routerUsers from "./routes/users.router.js";

//Import managers
import { productManager } from "./DAL/daos/mongo/products.dao.js";
import { chatManager } from "./DAL/daos/mongo/chat.dao.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

//Session
const MONGO_URI = config.mongo_uri
app.use(session({ 
  store: new MongoStore({mongoUrl: MONGO_URI}),
  secret: 'secretSession', 
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}))

//Passport
app.use(passport.initialize())
app.use(passport.session())

//HandleBars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

//Routers
app.use("/api/products", routerProduct);
app.use("/api/carts", routerCart);
app.use("/api/views", routerViews);
app.use("/api/sessions", routerSessions);
app.use("/api/users", routerUsers);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSetup))
app.use(errorMiddleware);

const PORT = config.port;
const httpServer = app.listen(PORT, () => {logger.info(`Servidor escuchando en el puerto ${PORT}`);});

const socketServer = new Server(httpServer);
const messagesTotal = [];
socketServer.on("connection", async (socket) => {
  const productosOld = await productManager.findAll();
  socket.emit("productsInitial", productosOld);
  socket.on("addProduct", async (product) => {
    const producto = await productManager.createOne(product);
    const productosActualizados = await productManager.findAll();
    socket.emit("productUpdate", productosActualizados);
  });

  socket.on("deleteProduct", async (productId) => {
    const productosOld = await productManager.findAll();
    const producto = await productManager.deleteOne(+productId);
    const productosActualizados = await productManager.findAll();
    socket.emit("productDelete", productosActualizados);
  });

  socket.on("newUser", (nUser) => {
    socket.broadcast.emit("userConnected", nUser)
  })

  //Chat
  socket.on("message", async (info) => {
    messagesTotal.push(info);
    const messageTotal = await chatManager.createOne(info);
    socketServer.emit("chatTotal", messagesTotal)
  })
});
 

