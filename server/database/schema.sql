-- Database schema for Voucher Platform
-- Run this SQL script to create the database and tables

CREATE DATABASE IF NOT EXISTS voucher_platform;
USE voucher_platform;

-- Users table (customers and admins)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    player_id VARCHAR(50),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    player_id VARCHAR(50) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    amount DECIMAL(10, 2) NOT NULL,
    transaction_id VARCHAR(100),
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Site settings table
CREATE TABLE site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@voucher.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample products
INSERT INTO products (name, description, price, category) VALUES 
('100 Likes', 'Get 100 likes for your social media post', 50.00, 'social-media'),
('500 Likes', 'Get 500 likes for your social media post', 200.00, 'social-media'),
('1000 Likes', 'Get 1000 likes for your social media post', 350.00, 'social-media'),
('Weekly Membership', 'Premium membership for one week', 100.00, 'membership'),
('Monthly Membership', 'Premium membership for one month', 350.00, 'membership');

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES 
('site_name', 'Voucher Platform'),
('site_footer', '© 2024 Voucher Platform. All rights reserved.'),
('support_email', 'support@voucher.com'),
('support_phone', '+880-123-456-789');
