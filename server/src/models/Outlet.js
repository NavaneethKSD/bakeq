const mongoose = require('mongoose');

const outletSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Outlet = mongoose.model('Outlet', outletSchema);

module.exports = { Outlet };
