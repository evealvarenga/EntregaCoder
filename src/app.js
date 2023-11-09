import express from 'express';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.routes.js';
import viewsRouter from './routes/views.routes.js';
import userRouter from './routes/users.routes.js';
import sessionsRouter from './routes/session.routes.js';
import { engine } from 'express-handlebars';
import { __dirname } from './utils.js';
import { Server } from 'socket.io';
import { chatManager } from './manager/chatManager.js';
import { productManager } from './manager/ProductManager.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import "./db/configDB.js"

const app = express();

const URI = "mongodb+srv://ealvarenga:HitomiEchizen100@cluster0.f2pvn62.mongodb.net/bdentrega15?retryWrites=true&w=majority"
app.use(session({
	store: new MongoStore({mongoUrl: URI}),
	secret: "secretSession",
	cookie: {maxAge:60000}
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser("SecretCookie"))

//Handlebars
app.engine("handlebars", engine());
app.set('view engine', "handlebars");
app.set('view', __dirname + "/views");

//Routes
app.use("/api/products", productRouter); 
app.use("/api/cart", cartRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(8080, () => {console.log(`Servidor escuchando en el puerto 8080`);});

//SocketServer
const socketServer = new Server(httpServer);
socketServer.on("connection", (socket)=> {
	socket.on("newMessage", async(message) =>{
		await chatManager.newOne(message)
		const messages = await chatManager.findAll()
		socketServer.emit("sendMessage", messages);
	});
});

socket.on("showProducts", async() => {
    const products = await productManager.findAll({limit:10, page:1, sort:{}, query:{} })
    socketServer.emit("sendProducts", products);
  });