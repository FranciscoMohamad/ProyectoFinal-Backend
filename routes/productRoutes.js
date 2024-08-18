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

// GET /api/products
router.get('/', async (req, res) => { 
    try {
        const { limit = 5, page = 1, sort, query } = req.query;

        const filter = query ? { category: query } : {};

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        };

        const products = await productModel.paginate(filter, options);

        res.render('index', {
            products: products.docs,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            totalPages: products.totalPages,
        });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

// Endpoint para obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const cartId = req.params.id;

        // Encuentra el carrito por su ID y popula los detalles de los productos
        const cart = await cartModel.findById(cartId).populate('products.product');

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        res.render('cartDetail', { cart }); // Renderiza la vista cartDetail con el carrito y sus productos
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito');
    }
});

// Endpoint para actualizar un producto
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { title, description, code, price, stock, category, thumbnails, status } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
    }

    try {
        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            { title, description, code, price: Number(price), stock: Number(stock), category, thumbnails: thumbnails || [], status },
            { new: true }
        );
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
    const id = req.params.id;
    try {
        const deletedProduct = await productModel.findByIdAndDelete(id);
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





