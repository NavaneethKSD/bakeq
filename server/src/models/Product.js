const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    available: { type: Boolean, default: true },
    outletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Outlet', required: true },
  },
  { timestamps: true }
);

productSchema.index({ outletId: 1, category: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };
