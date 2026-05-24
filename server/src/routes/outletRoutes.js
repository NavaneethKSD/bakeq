const express = require('express');
const { listOutlets } = require('../controllers/outletController');

const router = express.Router();

router.get('/', listOutlets);

module.exports = router;
