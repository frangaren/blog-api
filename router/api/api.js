'use strict';

const express = require('express');
const path = require('path');

const router = express.Router();
const v1Router = require(path.join(__dirname, 'v1', 'v1.js'));

router.use('/v1/', v1Router);

module.exports = router;