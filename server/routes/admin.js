const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and admin check to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
    try {
        // Get total customers
        const [customerCount] = await pool.execute(
            'SELECT COUNT(*) as count FROM users WHERE role = "customer"'
        );

        // Get total orders
        const [orderCount] = await pool.execute(
            'SELECT COUNT(*) as count FROM orders'
        );

        // Get pending orders
        const [pendingCount] = await pool.execute(
            'SELECT COUNT(*) as count FROM orders WHERE status = "pending"'
        );

        // Get completed orders
        const [completedCount] = await pool.execute(
            'SELECT COUNT(*) as count FROM orders WHERE status = "completed"'
        );

        // Get total revenue
        const [revenueResult] = await pool.execute(
            'SELECT SUM(amount) as total FROM orders WHERE status = "completed"'
        );

        // Get recent orders
        const [recentOrders] = await pool.execute(`
            SELECT o.id, o.player_id, o.status, o.amount, o.created_at, 
                   u.username, p.name as product_name
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN products p ON o.product_id = p.id
            ORDER BY o.created_at DESC
            LIMIT 10
        `);

        res.json({
            stats: {
                totalCustomers: customerCount[0].count,
                totalOrders: orderCount[0].count,
                pendingOrders: pendingCount[0].count,
                completedOrders: completedCount[0].count,
                totalRevenue: revenueResult[0].total || 0
            },
            recentOrders
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all orders with filtering and pagination
router.get('/orders', async (req, res) => {
    try {
        const { status, page = 1, limit = 20, search } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = '';
        let queryParams = [];

        if (status && status !== 'all') {
            whereClause = 'WHERE o.status = ?';
            queryParams.push(status);
        }

        if (search) {
            const searchCondition = whereClause ? 'AND' : 'WHERE';
            whereClause += ` ${searchCondition} (u.username LIKE ? OR o.player_id LIKE ? OR p.name LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        // Get orders with user and product info
        const [orders] = await pool.execute(`
            SELECT o.id, o.player_id, o.status, o.amount, o.transaction_id, 
                   o.payment_method, o.notes, o.created_at, o.updated_at,
                   u.username, u.email, u.phone,
                   p.name as product_name, p.description as product_description
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN products p ON o.product_id = p.id
            ${whereClause}
            ORDER BY o.created_at DESC
            LIMIT ? OFFSET ?
        `, [...queryParams, parseInt(limit), parseInt(offset)]);

        // Get total count for pagination
        const [countResult] = await pool.execute(`
            SELECT COUNT(*) as total
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN products p ON o.product_id = p.id
            ${whereClause}
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
        console.error('Orders fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, transaction_id, notes } = req.body;

        if (!['pending', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updates = ['status = ?'];
        const values = [status];

        if (transaction_id) {
            updates.push('transaction_id = ?');
            values.push(transaction_id);
        }

        if (notes) {
            updates.push('notes = ?');
            values.push(notes);
        }

        values.push(id);

        const [result] = await pool.execute(
            `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Order update error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete order
router.delete('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            'DELETE FROM orders WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Order delete error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all customers
router.get('/customers', async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE role = "customer"';
        let queryParams = [];

        if (search) {
            whereClause += ' AND (username LIKE ? OR email LIKE ? OR player_id LIKE ?)';
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        const [customers] = await pool.execute(`
            SELECT id, username, email, player_id, phone, created_at
            FROM users
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `, [...queryParams, parseInt(limit), parseInt(offset)]);

        const [countResult] = await pool.execute(`
            SELECT COUNT(*) as total FROM users ${whereClause}
        `, queryParams);

        res.json({
            customers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(countResult[0].total / limit),
                totalItems: countResult[0].total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Customers fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create manual order
router.post('/orders/manual', async (req, res) => {
    try {
        const { user_id, product_id, player_id, amount, notes } = req.body;

        if (!user_id || !product_id || !player_id || !amount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Verify user and product exist
        const [userCheck] = await pool.execute('SELECT id FROM users WHERE id = ?', [user_id]);
        const [productCheck] = await pool.execute('SELECT id, price FROM products WHERE id = ?', [product_id]);

        if (userCheck.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (productCheck.length === 0) {
            return res.status(400).json({ message: 'Product not found' });
        }

        const [result] = await pool.execute(
            'INSERT INTO orders (user_id, product_id, player_id, amount, notes, status) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, product_id, player_id, amount, notes || null, 'pending']
        );

        res.status(201).json({
            message: 'Order created successfully',
            orderId: result.insertId
        });
    } catch (error) {
        console.error('Manual order creation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
