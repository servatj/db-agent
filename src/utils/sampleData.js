const { executeTransaction } = require('./database');

/**
 * Add sample data to the database
 * @returns {Promise<void>} - A promise that resolves when the data is added
 */
async function addSampleData() {
  // Sample data SQL statements
  const statements = [
    // Categories
    `INSERT INTO categories (name, description) VALUES 
      ('Electronics', 'Electronic devices and gadgets'),
      ('Clothing', 'Apparel and fashion items'),
      ('Books', 'Books and publications'),
      ('Home', 'Home goods and furniture'),
      ('Sports', 'Sports equipment and accessories');`,
    
    // Users
    `INSERT INTO users (name, email, password, address, phone, registration_date) VALUES
      ('John Doe', 'john@example.com', 'password123', '123 Main St, City', '555-1234', '2023-01-15'),
      ('Jane Smith', 'jane@example.com', 'password456', '456 Oak St, Town', '555-5678', '2023-02-20'),
      ('Bob Johnson', 'bob@example.com', 'password789', '789 Pine St, Village', '555-9012', '2023-03-25'),
      ('Alice Brown', 'alice@example.com', 'passwordabc', '101 Elm St, County', '555-3456', '2023-04-30'),
      ('Charlie Davis', 'charlie@example.com', 'passworddef', '202 Maple St, State', '555-7890', '2023-05-05');`,
    
    // Products
    `INSERT INTO products (name, description, price, stock_quantity, category_id) VALUES
      ('Smartphone', 'Latest model smartphone with advanced features', 699.99, 50, 1),
      ('Laptop', 'High-performance laptop for work and gaming', 1299.99, 30, 1),
      ('T-shirt', 'Comfortable cotton t-shirt', 19.99, 100, 2),
      ('Jeans', 'Classic blue jeans', 49.99, 75, 2),
      ('Novel', 'Bestselling fiction novel', 14.99, 200, 3),
      ('Cookbook', 'Collection of gourmet recipes', 24.99, 150, 3),
      ('Coffee Table', 'Modern design coffee table', 199.99, 20, 4),
      ('Bed Frame', 'Queen size bed frame', 299.99, 15, 4),
      ('Basketball', 'Official size basketball', 29.99, 40, 5),
      ('Tennis Racket', 'Professional tennis racket', 89.99, 25, 5);`,
    
    // Orders
    `INSERT INTO orders (user_id, order_date, total_amount, status) VALUES
      (1, '2023-06-10', 749.98, 'Delivered'),
      (2, '2023-06-15', 1299.99, 'Shipped'),
      (3, '2023-06-20', 64.98, 'Processing'),
      (4, '2023-06-25', 224.98, 'Delivered'),
      (5, '2023-06-30', 119.98, 'Shipped'),
      (1, '2023-07-05', 39.98, 'Delivered'),
      (2, '2023-07-10', 499.97, 'Processing'),
      (3, '2023-07-15', 89.99, 'Shipped');`,
    
    // Order Items
    `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
      (1, 1, 1, 699.99),
      (1, 3, 2, 19.99),
      (2, 2, 1, 1299.99),
      (3, 3, 1, 19.99),
      (3, 5, 3, 14.99),
      (4, 6, 1, 24.99),
      (4, 7, 1, 199.99),
      (5, 9, 2, 29.99),
      (5, 10, 1, 89.99),
      (6, 3, 2, 19.99),
      (7, 7, 1, 199.99),
      (7, 8, 1, 299.99),
      (8, 10, 1, 89.99);`,
    
    // Reviews
    `INSERT INTO reviews (product_id, user_id, rating, comment, review_date) VALUES
      (1, 1, 5, 'Great smartphone, very fast!', '2023-06-20'),
      (1, 3, 4, 'Good phone but battery life could be better', '2023-06-25'),
      (2, 2, 5, 'Excellent laptop, perfect for my needs', '2023-06-30'),
      (3, 4, 3, 'Average quality t-shirt', '2023-07-05'),
      (3, 5, 4, 'Comfortable and fits well', '2023-07-10'),
      (5, 1, 5, 'Couldn\'t put it down, great story!', '2023-07-15'),
      (6, 2, 4, 'Great recipes, well explained', '2023-07-20'),
      (7, 3, 5, 'Beautiful coffee table, looks great in my living room', '2023-07-25'),
      (9, 4, 4, 'Good basketball, nice grip', '2023-07-30'),
      (10, 5, 5, 'Professional quality racket', '2023-08-05');`
  ];
  
  try {
    await executeTransaction(statements);
    console.log('Sample data added successfully');
    return { success: true, message: 'Sample data added successfully' };
  } catch (error) {
    console.error('Error adding sample data:', error);
    return { success: false, message: `Error adding sample data: ${error.message}` };
  }
}

module.exports = {
  addSampleData
}; 