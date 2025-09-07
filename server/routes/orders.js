const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, requireCustomer } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get user's orders
router.get('/my-orders', requireCustomer, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE o.user_id = ?';
        let queryParams = [req.user.id];

        if (status && status !== 'all') {
            whereClause += ' AND o.status = ?';
            queryParams.push(status);
        }

        const [orders] = await pool.execute(`
            SELECT o.id, o.player_id, o.status, o.amount, o.transaction_id, 
                   o.payment_method, o.notes, o.created_at, o.updated_at,
                   p.name as product_name, p.description as product_description
            FROM orders o
            JOIN products p ON o.product_id = p.id
            ${whereClause}
            ORDER BY o.created_at DESC
            LIMIT ? OFFSET ?
        `, [...queryParams, parseInt(limit), parseInt(offset)]);

        const [countResult] = await pool.execute(`
            SELECT COUNT(*) as total FROM orders o ${whereClause}
        `, queryParams);

        res.json({
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(countResult[0].total / limit),
                totalItems: countResult[0].total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('User orders fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new order
router.post('/', requireCustomer, [
    body('product_id').isInt().withMessage('Product ID must be a valid integer'),
    body('player_id').notEmpty().withMessage('Player ID is required'),
    body('payment_method').notEmpty().withMessage('Payment method is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { product_id, player_id, payment_method, notes } = req.body;

        // Get product details
        const [products] = await pool.execute(
            'SELECT id, name, price FROM products WHERE id = ? AND is_active = TRUE',
            [product_id]
        );

        if (products.length === 0) {
            return res.status(400).json({ message: 'Product not found or inactive' });
        }

        const product = products[0];

        // Create order
        const [result] = await pool.execute(
            'INSERT INTO orders (user_id, product_id, player_id, amount, payment_method, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, product_id, player_id, product.price, payment_method, notes || null, 'pending']
        );

        res.status(201).json({
            message: 'Order created successfully',
            order: {
                id: result.insertId,
                product_name: product.name,
                amount: product.price,
                status: 'pending',
                player_id,
                payment_method
            }
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get order details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [orders] = await pool.execute(`
            SELECT o.id, o.player_id, o.status, o.amount, o.transaction_id, 
                   o.payment_method, o.notes, o.created_at, o.updated_at,
                   u.username, u.email,
                   p.name as product_name, p.description as product_description
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN products p ON o.product_id = p.id
            WHERE o.id = ?
        `, [id]);

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orders[0];

        // Check if user can access this order (customer can only see their own orders)
        if (req.user.role === 'customer' && order.username !== req.user.username) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({ order });
    } catch (error) {
        console.error('Order details error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order (for payment confirmation)
router.put('/:id/payment', requireCustomer, [
    body('transaction_id').notEmpty().withMessage('Transaction ID is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { transaction_id } = req.body;

        // Verify order belongs to user
        const [orders] = await pool.execute(
            'SELECT id FROM orders WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order with transaction ID
        await pool.execute(
            'UPDATE orders SET transaction_id = ? WHERE id = ?',
            [transaction_id, id]
        );

        res.json({ message: 'Payment information updated successfully' });
    } catch (error) {
        console.error('Payment update error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
