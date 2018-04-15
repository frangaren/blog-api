'use strict';

const express = require('express');
const path = require('path');

const router = express.Router();
const apiRouter = require(path.join(__dirname, 'api', 'api.js'));

router.use('/api/', apiRouter);

module.exports = router;