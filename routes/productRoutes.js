import express from 'express';
import ProductManager from '../src/productManager.js';
import { io } from '../app.js'; // Importar io desde app.js

const router = express.Router();
const manager = new ProductManager('products.json');

// Endpoint para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
        }

        const newProduct = {
            title,
            description,
            code,
            price: Number(price),
            status: true,
            stock: Number(stock),
            category,
            thumbnails: thumbnails || [],
        };

        await manager.addProduct(newProduct);

        // Emitir evento de creación con el producto agregado
        io.emit('productCreated', newProduct);

        res.status(201).send('Producto agregado correctamente');
    } catch (err) {
        console.error('Error al agregar el producto:', err);
        res.status(500).send('Error interno al agregar el producto');
    }
});

// Endpoint para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await manager.getProducts();
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Error fetching products');
    }
});

// Endpoint para obtener un producto por ID
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const product = await manager.getProduct(id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).send('Error fetching product');
    }
});

// Endpoint para actualizar un producto
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description, code, price, stock, category, thumbnails, status } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
    }

    const updateFields = { title, description, code, price: Number(price), stock: Number(stock), category, thumbnails: thumbnails || [], status };

    try {
        const updatedProduct = await manager.updateProduct(id, updateFields);
        if (updatedProduct) {
            res.send('Producto actualizado');
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).send('Error al actualizar el producto');
    }
});

// Endpoint para eliminar un producto
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const deletedProduct = await manager.deleteProduct(id);
        if (deletedProduct) {
            // Emitir evento de eliminación con el ID del producto eliminado
            io.emit('productDeleted', id);
            res.send('Producto eliminado');
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error('Error al eliminar el producto:', err);
        res.status(500).send('Error al eliminar el producto');
    }
});

export default router;




