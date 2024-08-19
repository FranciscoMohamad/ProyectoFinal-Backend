import express from 'express';
import cartModel from '../src/models/cart.model.js';
import productModel from '../src/models/product.model.js';

const router = express.Router();

// Endpoint para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new cartModel({ products: [] });
        await newCart.save();
        res.status(201).send('Carrito creado correctamente');
    } catch (err) {
        console.error('Error al crear el carrito:', err);
        res.status(500).send('Error interno al crear el carrito');
    }
});

// Endpoint para obtener un carrito por ID
router.post('/:id/products', async (req, res) => {
    const { productId, quantity } = req.body;
    const cartId = req.params.id;

    if (!productId || !quantity) {
        return res.status(400).json({ error: 'El ID del producto y la cantidad son obligatorios' });
    }

    try {
        const cart = await cartModel.findById(cartId);
        const product = await productModel.findById(productId);

        if (!cart || !product) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }

        const existingProduct = cart.products.find(p => p.product.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        res.status(200).send('Producto agregado al carrito');
    } catch (err) {
        console.error('Error al agregar el producto al carrito:', err);
        res.status(500).send('Error al agregar el producto al carrito');
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

router.get('/:id', async (req, res) => {
    try {
        const cartId = req.params.id;

        // Encuentra el carrito por su ID y popula los detalles de los productos
        const cart = await cartModel.findById(cartId).populate('products.product');

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Renderiza la vista con los detalles del carrito
        res.render('cartDetail', { cart });

    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito');
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

// Endpoint para eliminar todos los productos de un carrito
router.delete('/:id/products', async (req, res) => {
    try {
        const cartId = req.params.id;

        // Encuentra el carrito por su ID
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Vacía la lista de productos
        cart.products = [];

        // Guarda los cambios
        await cart.save();
        res.send('Todos los productos del carrito han sido eliminados');
    } catch (err) {
        console.error('Error al eliminar los productos del carrito:', err);
        res.status(500).send('Error interno al eliminar los productos del carrito');
    }
});

// Endpoint para eliminar un producto de un carrito
router.delete('/:id/products/:productId', async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.id);

        if (cart) {
            console.log('Cart products:', cart.products);

            cart.products = cart.products.filter(p => {
                if (p.product) {
                    return p.product.toString() !== req.params.productId;
                }
                return false; 
            });

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

// Endpoint para actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const products = req.body.products;

    if (!Array.isArray(products)) {
        return res.status(400).json({ error: 'El cuerpo de la solicitud debe contener un arreglo de productos' });
    }

    try {
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        cart.products = products;
        await cart.save();
        res.send('Carrito actualizado con éxito');
    } catch (err) {
        console.error('Error al actualizar el carrito:', err);
        res.status(500).send('Error interno al actualizar el carrito');
    }
});

// Endpoint para actualizar la cantidad de un producto específico en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ error: 'La cantidad debe ser un número mayor que 0' });
    }

    try {
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const product = cart.products.find(p => p.product.toString() === productId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        // Actualiza la cantidad del producto
        product.quantity = quantity;

        await cart.save();
        res.send('Cantidad del producto actualizada con éxito');
    } catch (err) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', err);
        res.status(500).send('Error interno al actualizar la cantidad del producto en el carrito');
    }
});

export default router;


