CREATE DATABASE IF NOT EXISTS smartstay_ai;
USE smartstay_ai;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  user_type ENUM('student', 'owner', 'admin') NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(15),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(10),
  registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS property_owners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(15),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(10),
  property_details TEXT,
  registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS property_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT,
  property_name VARCHAR(255) NOT NULL,
  property_type VARCHAR(100) NOT NULL,
  rent DECIMAL(10,2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  distance_from_college FLOAT DEFAULT 0,
  amenities TEXT,
  description TEXT,
  image VARCHAR(1000),
  verified BOOLEAN DEFAULT FALSE,
  verification_score INT DEFAULT 0,
  risk ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES property_owners(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS booking_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  owner_id INT,
  property_id INT NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(15) NOT NULL,
  college VARCHAR(255) NOT NULL,
  move_in_date DATE,
  visit_mode VARCHAR(100),
  notes TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  request_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (owner_id) REFERENCES property_owners(id),
  FOREIGN KEY (property_id) REFERENCES properties(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  student_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_title VARCHAR(255),
  review TEXT,
  review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS support_queries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO property_types (id, category_name, description) VALUES
(1, 'PG', 'Managed paying guest accommodation for students.'),
(2, 'Hostel', 'Shared hostel rooms close to campus facilities.'),
(3, 'Apartment', 'Private apartments suitable for individual students.'),
(4, 'Shared Flat', 'Shared flats for students looking to split rent.')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO users (id, email, password, user_type) VALUES
(1, 'admin@smartstay.ai', '$2a$10$4X0Vbh0SG2SZ9QnWoD67Muf/hFHO0nG31N7lbBnSwe39ZwF9lsYZK', 'admin'),
(2, 'owner.demo@smartstay.ai', '$2a$10$4X0Vbh0SG2SZ9QnWoD67Muf/hFHO0nG31N7lbBnSwe39ZwF9lsYZK', 'owner')
ON DUPLICATE KEY UPDATE user_type = VALUES(user_type);

INSERT INTO property_owners (
  id, user_id, name, contact_number, address, city, state, country, postal_code, property_details
) VALUES
(1, 2, 'Demo Property Owner', '9876543210', 'College Road', 'Campus City', 'State', 'India', '110001', 'Student-friendly verified rental properties')
ON DUPLICATE KEY UPDATE property_details = VALUES(property_details);

INSERT INTO properties (
  id, owner_id, property_name, property_type, rent, location,
  distance_from_college, amenities, description, image,
  verified, verification_score, risk
) VALUES
(1, 1, 'Green Nest PG', 'PG', 4500.00, 'College Road', 0.8, 'WiFi, Laundry, Meals, Study Table', 'Verified girls PG with biometric entry, clean rooms, home-style meals, and quiet study hours near the main campus gate.', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80', TRUE, 94, 'Low'),
(2, 1, 'Metro Student Hostel', 'Hostel', 3200.00, 'Metro Colony', 1.5, 'WiFi, Security, Common Room, Laundry', 'Budget hostel with shared rooms, 24x7 security, common study lounge, and quick access to bus and metro stops.', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80', TRUE, 88, 'Low'),
(3, 1, 'Sunrise Studio Apartment', 'Apartment', 9800.00, 'Lake View Lane', 2.4, 'WiFi, Kitchen, Power Backup, Parking', 'Compact private studio for senior students, with kitchen access, power backup, and a calm residential neighborhood.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80', FALSE, 72, 'Medium'),
(4, 1, 'Campus Circle Shared Flat', 'Shared Flat', 6500.00, 'North Campus', 0.5, 'WiFi, Kitchen, Laundry, Furnished', 'Furnished shared flat with two rooms, a stocked kitchen, strong WiFi, and walking-distance access to libraries and cafes.', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80', TRUE, 91, 'Low'),
(5, 1, 'Budget Study Stay', 'PG', 2800.00, 'Old Bus Stand Area', 3.2, 'Meals, Security, Water Purifier', 'Low-rent student stay with basic furnished rooms, simple meals, and verified owner contact for students on tight budgets.', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=900&q=80', FALSE, 68, 'Medium'),
(6, 1, 'Scholars Safe Hostel', 'Hostel', 7200.00, 'Library Square', 0.9, 'WiFi, Laundry, CCTV, Meals, Power Backup', 'Premium hostel with CCTV coverage, fast WiFi, laundry, power backup, and meals designed around student schedules.', 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=80', TRUE, 96, 'Low')
ON DUPLICATE KEY UPDATE
  property_type = VALUES(property_type),
  rent = VALUES(rent),
  location = VALUES(location),
  distance_from_college = VALUES(distance_from_college),
  amenities = VALUES(amenities),
  description = VALUES(description),
  image = VALUES(image),
  verified = VALUES(verified),
  verification_score = VALUES(verification_score),
  risk = VALUES(risk);

COMMIT;
