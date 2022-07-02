const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({
    featured: false,
  });
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  // console.log(req.query);
  const { featured, company, name, price, rating, createdAt, sort, fields } =
    req.query;

  const queryObject = {};
  featured && (queryObject.featured = featured === 'true' ? true : false);
  company && (queryObject.company = company);
  name && (queryObject.name = { $regex: name, $options: 'i' });

  // console.log();
  const products = await Product.find(queryObject)
    .sort(sort ? sort.split(',').join(' ') : 'createdAt')
    .select(fields && fields.split(',').join(' '));

  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};

// sort.replace(',', ' ')
