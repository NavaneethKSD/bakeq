const { Product } = require('../models/Product');

const listProducts = async (req, res) => {
  const { outletId } = req.query;

  const filter = {};
  if (outletId) filter.outletId = outletId;

  const products = await Product.find(filter).sort({ category: 1, name: 1 }).lean();
  res.json({ products });
};

module.exports = { listProducts };
