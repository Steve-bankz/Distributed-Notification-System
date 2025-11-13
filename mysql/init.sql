-- MySQL initialization script
-- This creates multiple databases and users when MySQL container starts

-- Create template service database
CREATE DATABASE IF NOT EXISTS template_service;

-- Create user service database
CREATE DATABASE IF NOT EXISTS user_service;
GRANT ALL PRIVILEGES ON user_service.* TO 'root'@'%' IDENTIFIED BY 'supersecretpassword';

-- Apply changes
FLUSH PRIVILEGES;

USE template_service;

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed data for email templates
INSERT INTO templates (name, subject, body) VALUES
('welcome_email', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>'),
('password_reset', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>'),
('order_confirmation', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>'),
('account_verification', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>'),
('subscription_renewal', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>'),
('newsletter', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>'),
('invoice', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>'),
('notification_alert', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>')
ON DUPLICATE KEY UPDATE name=name;