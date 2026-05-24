const express = require('express');
const cors = require('cors');

const outletRoutes = require('./routes/outletRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

const createApp = ({ corsOrigin }) => {
  const app = express();

  app.use(
    cors({
      origin: corsOrigin || '*',
      methods: ['GET', 'POST', 'PATCH'],
    })
  );
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ ok: true }));

  app.use('/api/outlets', outletRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = { createApp };
