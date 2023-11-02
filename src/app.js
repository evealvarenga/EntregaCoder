import express from 'express';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.routes.js';
import viewsRouter from './routes/views.routes.js';
import { engine } from 'express-handlebars';
import { __dirname } from './utils.js';
import { Server } from 'socket.io';
import { chatManager } from './manager/chatManager.js';
import { productManager } from './manager/ProductManager.js';
import "./db/configDB.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", engine());
app.set('view engine', "handlebars");
app.set('view', __dirname + "/views");

//Routes
app.use("/api/products", productRouter); 
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);

//SocketServer
const httpServer = app.listen(8080, () => {console.log(`Servidor escuchando en el puerto 8080`);});
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