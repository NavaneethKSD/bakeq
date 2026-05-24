require('dotenv').config();

const { connectDb } = require('../config/db');
const { Outlet } = require('../models/Outlet');
const { Product } = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URI;

const run = async () => {
  await connectDb(MONGODB_URI);

  const outlets = await Outlet.insertMany(
    [
      { name: 'BakeQ Central', address: 'Main Road, City' },
      { name: 'BakeQ North', address: 'North Street, City' },
      { name: 'BakeQ East', address: 'East Avenue, City' },
      { name: 'BakeQ South', address: 'South Market, City' },
    ],
    { ordered: false }
  ).catch(async () => Outlet.find().lean());

  const outletDocs = Array.isArray(outlets) ? outlets : await Outlet.find().lean();

  const sampleMenu = [
    { name: 'Veg Puff', price: 20, category: 'Puffs' },
    { name: 'Egg Puff', price: 25, category: 'Puffs' },
    { name: 'Chicken Puff', price: 35, category: 'Puffs' },
    { name: 'Samosa', price: 15, category: 'Snacks' },
    { name: 'Tea', price: 12, category: 'Beverages' },
    { name: 'Coffee', price: 18, category: 'Beverages' },
  ];

  for (const outlet of outletDocs) {
    const existingCount = await Product.countDocuments({ outletId: outlet._id });
    if (existingCount > 0) continue;

    await Product.insertMany(
      sampleMenu.map((p) => ({
        ...p,
        available: true,
        outletId: outlet._id,
      }))
    );
  }

  // eslint-disable-next-line no-console
  console.log('Seed completed');
  process.exit(0);
};

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
