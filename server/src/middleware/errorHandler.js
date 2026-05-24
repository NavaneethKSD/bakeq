const errorHandler = (err, req, res, next) => {
  const statusCode =
    (err && err.statusCode) || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  const payload = {
    message: err.message || 'Server error',
  };

  if (err.details) payload.details = err.details;

  res.status(statusCode).json(payload);
};

module.exports = { errorHandler };
