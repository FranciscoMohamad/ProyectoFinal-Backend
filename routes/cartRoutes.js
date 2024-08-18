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

        // Si estás usando una vista para mostrar los detalles del carrito:
        res.render('cartDetail', { cart });

        // Si solo quieres devolver el JSON del carrito en Postman:
        // res.json(cart);

    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito');
    }
});

// Endpoint para obtener un carrito por ID
router.post('/:id/products', async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ error: 'El ID del producto y la cantidad son obligatorios' });
    }

    try {
        const cart = await cartModel.findById(req.params.id);
        const product = await productModel.findById(productId);

        console.log('Cart:', cart);  // Verificar que el carrito se está obteniendo correctamente
        console.log('Product:', product);  // Verificar que el producto se está obteniendo correctamente

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
        console.log('Producto agregado:', cart.products);  // Verificar que se está guardando el producto
        res.status(200).send('Producto agregado al carrito');
    } catch (err) {
        console.error('Error al agregar el producto al carrito:', err);
        res.status(500).send('Error al agregar el producto al carrito');
    }
});

// Endpoint para agregar un producto a un carrito
router.post('/:id/products', async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ error: 'El ID del producto y la cantidad son obligatorios' });
    }

    try {
        // Verificamos que ambos, el carrito y el producto, existan
        const cart = await cartModel.findById(req.params.id);
        const product = await productModel.findById(productId);

        console.log('Cart:', cart);  // Añade esto para depurar
        console.log('Product:', product);  // Añade esto para depurar

        if (!cart || !product) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }

        // Comprobamos si el producto ya existe en el carrito
        const existingProduct = cart.products.find(p => p.product.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;  // Si existe, aumentamos la cantidad
        } else {
            cart.products.push({ product: productId, quantity });  // Si no, lo agregamos
        }

        await cart.save();  // Guardamos el carrito actualizado
        res.status(200).send('Producto agregado al carrito');
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
            console.log('Cart products:', cart.products);  // Añade esto para depurar

            cart.products = cart.products.filter(p => {
                if (p.product) {
                    return p.product.toString() !== req.params.productId;
                }
                return false;  // Excluye productos sin el campo `product`
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


