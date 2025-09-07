const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get site settings (public endpoint)
router.get('/', async (req, res) => {
    try {
        const [settings] = await pool.execute(
            'SELECT setting_key, setting_value FROM site_settings'
        );

        const settingsObj = {};
        settings.forEach(setting => {
            settingsObj[setting.setting_key] = setting.setting_value;
        });

        res.json({ settings: settingsObj });
    } catch (error) {
        console.error('Settings fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin routes for settings management
router.use(authenticateToken);
router.use(requireAdmin);

// Get all settings - Admin only
router.get('/admin/all', async (req, res) => {
    try {
        const [settings] = await pool.execute(
            'SELECT id, setting_key, setting_value, created_at, updated_at FROM site_settings ORDER BY setting_key'
        );

        res.json({ settings });
    } catch (error) {
        console.error('Admin settings fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update site settings - Admin only
router.put('/', [
    body('settings').isObject().withMessage('Settings must be an object')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { settings } = req.body;

        // Update each setting
        for (const [key, value] of Object.entries(settings)) {
            await pool.execute(
                'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
                [key, value, value]
            );
        }

        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Settings update error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update specific setting - Admin only
router.put('/:key', [
    body('value').notEmpty().withMessage('Setting value is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { key } = req.params;
        const { value } = req.body;

        const [result] = await pool.execute(
            'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
            [key, value, value]
        );

        res.json({ message: 'Setting updated successfully' });
    } catch (error) {
        console.error('Setting update error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete setting - Admin only
router.delete('/:key', async (req, res) => {
    try {
        const { key } = req.params;

        const [result] = await pool.execute(
            'DELETE FROM site_settings WHERE setting_key = ?',
            [key]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        res.json({ message: 'Setting deleted successfully' });
    } catch (error) {
        console.error('Setting delete error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
