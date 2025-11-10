-- MySQL initialization script
-- This creates multiple databases and users when MySQL container starts

-- Create template service database
CREATE DATABASE IF NOT EXISTS template_service;
-- Create user with password
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'pass';
-- Grant privileges
GRANT ALL PRIVILEGES ON template_service.* TO 'user'@'%';

-- Apply changes
FLUSH PRIVILEGES;
