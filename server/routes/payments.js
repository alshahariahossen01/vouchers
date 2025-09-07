const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Payment webhook handler (example for bKash)
router.post('/webhook/bkash', async (req, res) => {
  try {
    const { 
      paymentID, 
      status, 
      amount, 
      currency, 
      merchantInvoiceNumber,
      transactionStatus 
    } = req.body;

    // Verify webhook signature (implement based on your payment gateway)
    // const isValidSignature = verifyWebhookSignature(req.body, req.headers['x-signature']);
    // if (!isValidSignature) {
    //   return res.status(400).json({ message: 'Invalid signature' });
    // }

    if (status === 'Completed' && transactionStatus === 'Completed') {
      // Find order by merchant invoice number
      const [orders] = await pool.execute(
        'SELECT id FROM orders WHERE id = ?',
        [merchantInvoiceNumber]
      );

      if (orders.length > 0) {
        // Update order status and transaction ID
        await pool.execute(
          'UPDATE orders SET status = ?, transaction_id = ?, updated_at = NOW() WHERE id = ?',
          ['completed', paymentID, merchantInvoiceNumber]
        );

        // Get order details for notification
        const [orderDetails] = await pool.execute(`
          SELECT o.*, u.email, u.username, p.name as product_name
          FROM orders o
          JOIN users u ON o.user_id = u.id
          JOIN products p ON o.product_id = p.id
          WHERE o.id = ?
        `, [merchantInvoiceNumber]);

        if (orderDetails.length > 0) {
          const order = orderDetails[0];
          
          // Send confirmation email (implement email service)
          // await sendOrderConfirmationEmail(order.email, order);
          
          console.log(`Order ${merchantInvoiceNumber} completed successfully`);
        }
      }
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

// Payment verification endpoint
router.post('/verify/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { transaction_id, payment_method } = req.body;

    // Verify order belongs to user
    const [orders] = await pool.execute(
      'SELECT id, user_id FROM orders WHERE id = ? AND user_id = ?',
      [orderId, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order with transaction ID
    await pool.execute(
      'UPDATE orders SET transaction_id = ?, payment_method = ?, updated_at = NOW() WHERE id = ?',
      [transaction_id, payment_method, orderId]
    );

    res.json({ message: 'Payment information updated successfully' });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

// Get payment methods
router.get('/methods', async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'bkash',
        name: 'bKash',
        description: 'Mobile financial service',
        icon: '📱',
        enabled: true
      },
      {
        id: 'nagad',
        name: 'Nagad',
        description: 'Mobile financial service',
        icon: '📱',
        enabled: true
      },
      {
        id: 'rocket',
        name: 'Rocket',
        description: 'Mobile financial service',
        icon: '📱',
        enabled: true
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct bank transfer',
        icon: '🏦',
        enabled: true
      }
    ];

    res.json({ paymentMethods });
  } catch (error) {
    console.error('Payment methods error:', error);
    res.status(500).json({ message: 'Failed to fetch payment methods' });
  }
});

// Admin: Payment statistics
router.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get payment method statistics
    const [paymentStats] = await pool.execute(`
      SELECT 
        payment_method,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM orders 
      WHERE status = 'completed'
      GROUP BY payment_method
    `);

    // Get daily revenue for last 30 days
    const [dailyRevenue] = await pool.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders_count,
        SUM(amount) as revenue
      FROM orders 
      WHERE status = 'completed' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    res.json({
      paymentMethods: paymentStats,
      dailyRevenue
    });
  } catch (error) {
    console.error('Payment stats error:', error);
    res.status(500).json({ message: 'Failed to fetch payment statistics' });
  }
});

module.exports = router;
