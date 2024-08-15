import express from 'express';
import productModel from '../src/models/product.model.js';

const router = express.Router();

// Endpoint para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
        }

        const newProduct = new productModel({
            title,
            description,
            code,
            price: Number(price),
            status: true,
            stock: Number(stock),
            category,
            thumbnails: thumbnails || [],
        });

        await newProduct.save();
        res.status(201).send('Producto agregado correctamente');
    } catch (err) {
        console.error('Error al agregar el producto:', err);
        res.status(500).send('Error interno al agregar el producto');
    }
});

// Endpoint para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productModel.find();
        res.json(products);
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});

// Endpoint para obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error('Error al obtener el producto:', err);
        res.status(500).send('Error al obtener el producto');
    }
});

// Endpoint para actualizar un producto
router.put('/:id', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails, status } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
        }

        const updateFields = {
            title,
            description,
            code,
            price: Number(price),
            stock: Number(stock),
            category,
            thumbnails: thumbnails || [],
            status,
        };

        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, updateFields, { new: true });
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
    try {
        const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
        if (deletedProduct) {
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




