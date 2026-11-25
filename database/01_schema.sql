CREATE DATABASE IF NOT EXISTS verde_sana CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE verde_sana;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('guest','member','admin') NOT NULL DEFAULT 'member',
    avatar VARCHAR(255) NULL,
    is_locked TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    description TEXT NULL,
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    image VARCHAR(255) NULL,
    kcal INT NULL,
    protein DECIMAL(6,2) NULL,
    carbs DECIMAL(6,2) NULL,
    fat DECIMAL(6,2) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    status ENUM('pending','confirmed','preparing','delivering','completed','cancelled') NOT NULL DEFAULT 'pending',
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    content LONGTEXT NULL,
    meta_title VARCHAR(255) NULL,
    meta_description VARCHAR(500) NULL,
    meta_keywords VARCHAR(255) NULL,
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY DEFAULT 1,
    company_name VARCHAR(150) NOT NULL DEFAULT 'Verde Sana',
    logo VARCHAR(255) NULL,
    banner VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(150) NULL,
    address TEXT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS about_content (
    id INT PRIMARY KEY DEFAULT 1,
    title VARCHAR(255) NOT NULL DEFAULT 'Ve Verde Sana',
    content TEXT NULL,
    image VARCHAR(255) NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NULL,
    message TEXT NOT NULL,
    status ENUM('new','processed','closed') NOT NULL DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS salad_ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type ENUM('base','ingredient','sauce') NOT NULL,
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    image VARCHAR(255) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NULL,
    name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    custom_data JSON NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    post_id INT NULL,
    product_id INT NULL,
    rating TINYINT NULL,
    content TEXT NOT NULL,
    status ENUM('pending','visible','hidden') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_comments_product FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
