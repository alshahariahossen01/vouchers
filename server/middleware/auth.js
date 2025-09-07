const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify user still exists and get current user data
        const [users] = await pool.execute(
            'SELECT id, username, email, role FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = users[0];
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// Middleware to check if user is customer
const requireCustomer = (req, res, next) => {
    if (req.user.role !== 'customer') {
        return res.status(403).json({ message: 'Customer access required' });
    }
    next();
};

module.exports = {
    authenticateToken,
    requireAdmin,
    requireCustomer
};
