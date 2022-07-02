require('dotenv').config();

const connectDB = require('./db/connect');

const Product = require('./models/product');

const jsonProducts = require('./products.json');

// Start server
try {
  const connection = connectDB(process.env.DB_URI);
  Product.deleteMany();
  Product.create(jsonProducts);
  console.log('Connected to DB');
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
