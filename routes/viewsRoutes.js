import express from 'express';
import { Router } from 'express';
import productModel from '../src/models/product.model.js';
import mongoose from "mongoose";


const router = Router();

// Ruta para la vista de la página de inicio
router.get('/', async (req, res) => {
    try {
        const limit = 5;
        const page = parseInt(req.query.page) || 1;
        
        const products = await productModel
            .find()
            .skip((page - 1) * limit)
            .limit(limit);

        const totalProducts = await productModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        const previousPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        res.render('index', {
            products,
            currentPage: page,
            totalPages,
            previousPage,
            nextPage
        });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});

router.get('/product/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Validación para asegurar que productId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send('ID de producto inválido');
        }

        const product = await productModel.findById(productId);

        if (product) {
            res.render('productDetail', { product });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (err) {
        console.error('Error al obtener el producto:', err);
        res.status(500).send('Error interno al obtener el producto');
    }
});

export default router;

