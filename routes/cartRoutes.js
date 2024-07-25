import express from 'express';
import CartManager from '../src/cartManager.js';

const router = express.Router();
const cartManager = new CartManager('carts.json');

// Endpoints del CARRITO

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json(newCart);
    } catch (err) {
        console.error('Error adding cart:', err);
        res.status(500).send('Error adding cart');
    }
});

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (err) {
        console.error('Error fetching carts:', err);
        res.status(500).send('Error fetching carts');
    }
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const cart = await cartManager.getCart(id);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).send('Error fetching cart');
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    try {
        const updatedCart = await cartManager.addProductToCart(cartId, productId);
        res.json(updatedCart);
    } catch (err) {
        console.error('Error adding product to cart:', err);
        res.status(404).send('Cart not found');
    }
});

export default router;

