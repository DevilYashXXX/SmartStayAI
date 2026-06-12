exports.table = [
  {
    tableName: "users",
    query: `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        user_type ENUM('student', 'owner', 'admin') NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `,
  },
  {
    tableName: "students",
    query: `
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        contact_number VARCHAR(15) NULL,
        address TEXT NULL,
        city VARCHAR(100) NULL,
        state VARCHAR(100) NULL,
        country VARCHAR(100) NULL,
        postal_code VARCHAR(10) NULL,
        registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `,
  },
  {
    tableName: "property_owners",
    query: `
      CREATE TABLE IF NOT EXISTS property_owners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        contact_number VARCHAR(15) NULL,
        address TEXT NULL,
        city VARCHAR(100) NULL,
        state VARCHAR(100) NULL,
        country VARCHAR(100) NULL,
        postal_code VARCHAR(10) NULL,
        property_details TEXT NULL,
        registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `,
  },
  {
    tableName: "property_types",
    query: `
      CREATE TABLE IF NOT EXISTS property_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `,
  },
  {
    tableName: "properties",
    query: `
      CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        owner_id INT NULL,
        property_name VARCHAR(255) NOT NULL,
        property_type VARCHAR(100) NOT NULL,
        rent DECIMAL(10, 2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        distance_from_college FLOAT DEFAULT 0,
        amenities TEXT NULL,
        description TEXT NULL,
        image VARCHAR(1000) NULL,
        verified BOOLEAN DEFAULT FALSE,
        verification_score INT DEFAULT 0,
        risk ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES property_owners(id)
      );
    `,
  },
  {
    tableName: "booking_requests",
    query: `
      CREATE TABLE IF NOT EXISTS booking_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NULL,
        owner_id INT NULL,
        property_id INT NOT NULL,
        student_name VARCHAR(255) NOT NULL,
        contact_number VARCHAR(15) NOT NULL,
        college VARCHAR(255) NOT NULL,
        move_in_date DATE NULL,
        visit_mode VARCHAR(100) NULL,
        notes TEXT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        request_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (owner_id) REFERENCES property_owners(id),
        FOREIGN KEY (property_id) REFERENCES properties(id)
      );
    `,
  },
  {
    tableName: "reviews",
    query: `
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        property_id INT NOT NULL,
        student_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        review_title VARCHAR(255) NULL,
        review TEXT NULL,
        review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id),
        FOREIGN KEY (student_id) REFERENCES students(id)
      );
    `,
  },
  {
    tableName: "support_queries",
    query: `
      CREATE TABLE IF NOT EXISTS support_queries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
];
