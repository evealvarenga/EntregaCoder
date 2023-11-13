import express from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import MongoStore  from "connect-mongo";
import cookieParser  from "cookie-parser";
import session from "express-session";
import "./db/configDB.js"

//Import Routers
import routerProduct from "./routes/products.router.js";
import routerCart from "./routes/cart.router.js";
import routerSessions from "./routes/sessions.router.js";
import routerViews from "./routes/views.router.js";

//Import managers
import { productManager } from "./db/manager/productManager.js";
import { MessagesManager } from "./db/manager/messagesManager.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

//Mongo
const URI = "mongodb+srv://ealvarenga:HitomiEchizen100@cluster0.f2pvn62.mongodb.net/bdentrega15?retryWrites=true&w=majority"
app.use(session({ 

  store: new MongoStore({mongoUrl: URI}),
  secret: 'secretSession', 
  cookie: { maxAge: 60000 }

}))

//HandleBars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

//Routers
app.use("/api/products", routerProduct);
app.use("/api/carts", routerCart);
app.use("/api/views", routerViews);
app.use("/api/sessions", routerSessions);

const httpServer = app.listen(8080, () => {console.log("Servidor escuchando en el puerto 8080");});

const socketServer = new Server(httpServer);
const messagesTotal = [];
socketServer.on("connection", async (socket) => {
  const productosOld = await productManager.getProduct();
  socket.emit("productsInitial", productosOld);
  socket.on("addProduct", async (product) => {
    const producto = await productManager.createOne(product);
    const productosActualizados = await productManager.getProduct();
    socket.emit("productUpdate", productosActualizados);
  });

  socket.on("deleteProduct", async (productId) => {
    const productosOld = await productManager.getProduct();
    const producto = await productManager.deleteOne(+productId);
    const productosActualizados = await productManager.getProduct();
    socket.emit("productDelete", productosActualizados);
  });

  socket.on("newUser", (nUser) => {
    socket.broadcast.emit("userConnected", nUser)
  })

  //Chat
  socket.on("message", async (info) => {
    messagesTotal.push(info);
    const messageTotal = await MessagesManager.createOneMessage(info);
    socketServer.emit("chatTotal", messagesTotal)
  })
});
 

