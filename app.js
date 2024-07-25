import  express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './src/utils.js'
import { Server } from 'socket.io'
import viewsRoutes from './routes/viewsRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();
const PORT = 8082;

// Config Handlebars para manejo de endpoints

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
//Recursos estaticos
app.use(express.static(__dirname + '/public'))

// Middleware para parsear JSON
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/', viewsRoutes);

const httpServer = app.listen(8082, ()=> console.log(`Server running on port ${PORT}`))
const socketServer = new Server(httpServer)

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado")
    socket.on('message', data => {
        console.log(`soy la data ${data}`)
    })
})