const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all active products (public endpoint)
router.get('/', async (req, res) => {
    try {
        const [products] = await pool.execute(
            'SELECT id, name, description, price, category FROM products WHERE is_active = TRUE ORDER BY category, name'
        );

        res.json({ products });
    } catch (error) {
        console.error('Products fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get product by ID (public endpoint)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [products] = await pool.execute(
            'SELECT id, name, description, price, category FROM products WHERE id = ? AND is_active = TRUE',
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ product: products[0] });
    } catch (error) {
        console.error('Product fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin routes for product management
router.use(authenticateToken);
router.use(requireAdmin);

// Get all products (including inactive) - Admin only
router.get('/admin/all', async (req, res) => {
    try {
        const [products] = await pool.execute(
            'SELECT id, name, description, price, category, is_active, created_at, updated_at FROM products ORDER BY created_at DESC'
        );

        res.json({ products });
    } catch (error) {
        console.error('Admin products fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new product - Admin only
router.post('/', [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, price, category } = req.body;

        const [result] = await pool.execute(
            'INSERT INTO products (name, description, price, category) VALUES (?, ?, ?, ?)',
            [name, description || null, price, category]
        );

        res.status(201).json({
            message: 'Product created successfully',
            product: {
                id: result.insertId,
                name,
                description,
                price,
                category
            }
        });
    } catch (error) {
        console.error('Product creation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update product - Admin only
router.put('/:id', [
    body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, description, price, category, is_active } = req.body;

        const updates = [];
        const values = [];

        if (name !== undefined) {
            updates.push('name = ?');
            values.push(name);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description);
        }
        if (price !== undefined) {
            updates.push('price = ?');
            values.push(price);
        }
        if (category !== undefined) {
            updates.push('category = ?');
            values.push(category);
        }
        if (is_active !== undefined) {
            updates.push('is_active = ?');
            values.push(is_active);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        values.push(id);

        const [result] = await pool.execute(
            `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Product update error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete product - Admin only
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if product has any orders
        const [orders] = await pool.execute(
            'SELECT COUNT(*) as count FROM orders WHERE product_id = ?',
            [id]
        );

        if (orders[0].count > 0) {
            return res.status(400).json({ 
                message: 'Cannot delete product with existing orders. Deactivate instead.' 
            });
        }

        const [result] = await pool.execute(
            'DELETE FROM products WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Product delete error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
