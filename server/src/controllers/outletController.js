const { Outlet } = require('../models/Outlet');

const listOutlets = async (req, res) => {
  const outlets = await Outlet.find().sort({ name: 1 }).lean();
  res.json({ outlets });
};

module.exports = { listOutlets };
