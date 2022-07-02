require('dotenv').config();
require('express-async-errors');

const express = require('express');
const morgan = require('morgan');
const connectDB = require('./db/connect');

// Initialization
const app = express();
const hostname = '127.0.0.1';
const port = process.env.DB_PORT || 3000;

// Controllers
const productsRouter = require('./routes/products');

// Middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

app.use(morgan('dev')); //'tiny' 'short' 'common' 'combined'

// ROUTES
// root
app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

app.get('/about', (req, res) => {
  res.send(JSON.stringify({ about: 'We are a dedicated company' }));
});

// Route Controllers
app.use('/api/v1/products', productsRouter);

// Middleware Handlers
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Start server
try {
  const connection = connectDB(process.env.DB_URI);
  app.listen(port, () => {
    console.log(
      `Server Listening on port ${port} at http://${hostname}:${port}/`
    );
  });
} catch (error) {
  console.log(error);
}

// const hostname = '127.0.0.1';
// const hostname = 'localhost';

// app.use(express.static('./public'));

// app.all('*', (req, res) => {
//   res.send('<h1>Not found</h1>');
// });
