import express from 'express';
import { create as createHandlebars } from 'express-handlebars'; // Importar el método create
import __dirname from './src/utils.js';
import { Server } from 'socket.io';
import viewsRoutes from './routes/viewsRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();
const PORT = 8082;

// Configuración de Handlebars
const hbs = createHandlebars({
    layoutsDir: __dirname + '/views/layouts/', // Directorio de layouts
    defaultLayout: 'main', // Nombre del archivo de layout
    extname: '.handlebars' // Extensión de los archivos de plantilla
});

app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Recursos estáticos
app.use(express.static(__dirname + '/public'));

// Middleware para parsear JSON
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/', viewsRoutes);

const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const io = new Server(httpServer); // Crear instancia de Server para WebSocket

io.on('connection', socket => {
    console.log("Nuevo cliente conectado");
    socket.on('message', data => {
        console.log(`Soy la data ${data}`);
    });
});

export { io }; // Exportar io para usarlo en otros archivos