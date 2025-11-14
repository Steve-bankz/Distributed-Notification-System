-- MySQL initialization script
-- This creates multiple databases and users when MySQL container starts
-- Create template service database
CREATE DATABASE IF NOT EXISTS template_service;
-- Create user service database
CREATE DATABASE IF NOT EXISTS user_service;
-- TEMPLATE SERVICE SETUP

CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'supersecretpassword';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
ALTER USER 'root'@'%' IDENTIFIED BY 'supersecretpassword';
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
-- USER SERVICE SETUP
USE user_service;
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    preferences JSON NOT NULL DEFAULT (
        JSON_OBJECT(
            'push_notification_enabled', FALSE,
            'email_notification_enabled', FALSE
        )
    ),
    push_tokens JSON NOT NULL DEFAULT (JSON_ARRAY()),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Seed users
INSERT INTO users (
    user_id,
    name,
    email,
    password,
    preferences,
    push_tokens
) VALUES
(
    UUID(),
    'John Doe',
    'john@example.com',
    '$2y$10$abcdefghijklmnopqrstuv1234567890abcdefghi',
    JSON_OBJECT(
        'push_notification_enabled', TRUE,
        'email_notification_enabled', TRUE
    ),
    JSON_ARRAY()
),
(
    UUID(),
    'Jane Smith',
    'jane@example.com',
    '$2y$10$zyxwvutsrqponmlkjihgf0987654321abcdabcd12',
    JSON_OBJECT(
        'push_notification_enabled', FALSE,
        'email_notification_enabled', TRUE
    ),
    JSON_ARRAY()
 ),
(
    UUID(),
    'Michael Brown',
    'mike@example.com',
    '$2y$10$qwertyuiopasdfghjklzxcvbnm1234567890test',
    JSON_OBJECT(
        'push_notification_enabled', TRUE,
        'email_notification_enabled', FALSE
    ),
    JSON_ARRAY('token123', 'token456')
)
ON DUPLICATE KEY UPDATE email=email;