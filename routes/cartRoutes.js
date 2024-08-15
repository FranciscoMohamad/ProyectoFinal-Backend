import express from 'express';
import cartModel from '../src/models/cart.model.js';

const router = express.Router();

// Endpoint para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new cartModel({
            products: [],
        });

        await newCart.save();
        res.status(201).send('Carrito creado correctamente');
    } catch (err) {
        console.error('Error al crear el carrito:', err);
        res.status(500).send('Error interno al crear el carrito');
    }
});

// Endpoint para obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await cartModel.find();
        res.json(carts);
    } catch (err) {
        console.error('Error al obtener los carritos:', err);
        res.status(500).send('Error al obtener los carritos');
    }
});

// Endpoint para obtener un carrito por ID
router.get('/:id', async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.id);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (err) {
        console.error('Error al obtener el carrito:', err);
        res.status(500).send('Error al obtener el carrito');
    }
});

// Endpoint para agregar un producto a un carrito
router.post('/:id/products', async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ error: 'El ID del producto y la cantidad son obligatorios' });
    }

    try {
        const cart = await cartModel.findById(req.params.id);
        if (cart) {
            const existingProduct = cart.products.find(p => p.productId.toString() === productId);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }

            await cart.save();
            res.send('Producto agregado al carrito');
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (err) {
        console.error('Error al agregar el producto al carrito:', err);
        res.status(500).send('Error al agregar el producto al carrito');
    }
});

// Endpoint para eliminar un producto de un carrito
router.delete('/:id/products/:productId', async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.id);
        if (cart) {
            cart.products = cart.products.filter(p => p.productId.toString() !== req.params.productId);
            await cart.save();
            res.send('Producto eliminado del carrito');
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (err) {
        console.error('Error al eliminar el producto del carrito:', err);
        res.status(500).send('Error al eliminar el producto del carrito');
    }
});

// Endpoint para eliminar un carrito
router.delete('/:id', async (req, res) => {
    try {
        const deletedCart = await cartModel.findByIdAndDelete(req.params.id);
        if (deletedCart) {
            res.send('Carrito eliminado');
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (err) {
        console.error('Error al eliminar el carrito:', err);
        res.status(500).send('Error al eliminar el carrito');
    }
});

export default router;

