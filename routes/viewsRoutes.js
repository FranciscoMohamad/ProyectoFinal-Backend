import express from 'express';
import { Router } from 'express';
import ProductManager from '../src/productManager.js';

const router = Router();
const productManager = new ProductManager('products.json');

// Ruta para la vista de la página de inicio
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('index', { products, name: "Usuario" }); // Enviar productos y nombre a la vista
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});

export default router;

