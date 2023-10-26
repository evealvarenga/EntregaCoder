import express from 'express';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.routes.js';
import viewsRouter from './routes/views.routes.js';
import { engine } from 'express-handlebars';
import { __dirname } from './utils.js';
import { Server } from 'socket.io';
import ProductManager from './manager/ProductManager.js';
import "./db/configDB.js"

const manager = new ProductManager();

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
app.use("/api/views", viewsRouter);

//SocketServer
const httpServer = app.listen(8080, () => {console.log(`Servidor escuchando en el puerto 8080`);});
const socketServer = new Server(httpServer);
socketServer.on('connection', (socket)=> {
	console.log('cliente conectado')
	try {
		socket.on('product', async (product)  => {
			await manager.addProduct(product)
		})
	} catch (error) {
		return error
	}
	try {
		socket.on('id', async (id)  => {
			await manager.deleteProduct(+id)
		})
	} catch (error) {
		return error
	}
})