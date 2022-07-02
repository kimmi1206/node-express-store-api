const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({
    featured: false,
  });
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  // console.log(req.query);
  const {
    featured,
    company,
    name,
    price,
    rating,
    createdAt,
    sort,
    fields,
    page,
    limit,
    numericFilters,
  } = req.query;

  const queryObject = {};
  featured && (queryObject.featured = featured === 'true' ? true : false);
  company && (queryObject.company = company);
  name && (queryObject.name = { $regex: name, $options: 'i' });

  const sortFields = sort ? sort.split(',').join(' ') : 'createdAt';
  const filterFields = (fields && fields.split(',').join(' ')) || '';
  const pageNumber = (page && Number(page)) || 1;
  const limitNumber = (page && Number(limit)) || 10;
  const skipPage = (pageNumber - 1) * limitNumber;

  let filters;
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(>|>=|=|<|<=)\b/g;

    filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ['price', 'rating'];

    filters = filters.split(',');

    filters.forEach((item) => {
      console.log(item);
      const [field, operator, value] = item.split('-');

      if (options.includes(field))
        queryObject[field] = { [operator]: Number(value) };
    });
  }

  const products = await Product.find(queryObject)
    .sort(sortFields)
    .select(filterFields)
    .skip(skipPage)
    .limit(limitNumber);

  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};

// sort.replace(',', ' ')
