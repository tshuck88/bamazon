DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 	("shoes", "apparel", 59.50, 100), 
		("shirt", "apparel", 29.50, 70), 
		("socks", "apparel", 10.00, 200), 
        ("cell phone", "electronics", 899.50, 45), 
        ("tv", "electronics", 500.00, 100), 
        ("tablet", "electronics", 600.00, 100),
        ("headphones", "electronics", 89.50, 60),
        ("pillow", "home goods", 49.50, 100),
        ("blanket", "home goods", 79.50, 50),
        ("sheets", "home goods", 39.50, 80);
