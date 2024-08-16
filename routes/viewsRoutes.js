import express from 'express';
import { Router } from 'express';
import productModel from '../src/models/product.model.js'; // Importa el modelo de producto de MongoDB

const router = Router();

// Ruta para la vista de la página de inicio
router.get('/', async (req, res) => {
    try {
        const products = await productModel.find(); // Obtén los productos desde la base de datos MongoDB
        res.render('index', { products, name: "Usuario" }); // Enviar productos y nombre a la vista
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productModel.find(); // Obtén los productos desde la base de datos MongoDB
        res.render('realTimeProducts', { products });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});

export default router;

