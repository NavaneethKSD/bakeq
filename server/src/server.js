require('dotenv').config();

const { createApp } = require('./app');
const { connectDb } = require('./config/db');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

const start = async () => {
  await connectDb(MONGODB_URI);
  const app = createApp({ corsOrigin: CORS_ORIGIN });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${PORT}`);
  });
};

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
