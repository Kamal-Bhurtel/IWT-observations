-- Contact Management System Database
-- Import this file in phpMyAdmin

CREATE DATABASE IF NOT EXISTS contact_manager;
USE contact_manager;

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample data (optional)
INSERT INTO contacts (name, email, phone, address, notes) VALUES
('John Doe', 'john.doe@example.com', '+1-555-0101', '123 Main St, New York, NY', 'Friend from college'),
('Jane Smith', 'jane.smith@example.com', '+1-555-0102', '456 Oak Ave, Los Angeles, CA', 'Work colleague'),
('Robert Johnson', 'robert.j@example.com', '+1-555-0103', '789 Pine Rd, Chicago, IL', 'Family friend');