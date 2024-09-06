import express from 'express';
import { create as createHandlebars } from 'express-handlebars';
import bodyParser from 'body-parser';
import __dirname from './utils.js';
//Rutas
import viewsRoutes from './routes/viewsRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
// import userRoutes from './routes/userRoutes.js';
import mongoose from "mongoose";



const app = express();
const PORT = 8082;

//Coneccion a MongoDB
mongoose.connect("mongodb+srv://elmoha624:Horacio2001@cluster0.dqusn.mongodb.net/MyDataBase?retryWrites=true&w=majority&appName=Cluster0")

.then(()=>{
    console.log("conectado a la base de datos")
})
.catch(error=> {
    console.log("error al contectar con la base de datos",error)
})

// Configuración de Handlebars
const hbs = createHandlebars({
    layoutsDir: __dirname + '/views/layouts/', 
    defaultLayout: 'main', 
    extname: '.handlebars', 
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,  
        allowProtoMethodsByDefault: true
    }
   
});


app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Recursos estáticos
app.use(express.static(__dirname + '/public'));

// Middleware para parsear JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/', viewsRoutes);
// app.use('/',userRoutes )

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
