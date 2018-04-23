'use strict';

const express = require('express');
const path = require('path');

const router = express.Router();
const v1Router = require(path.join(__dirname, 'v1', 'v1.js'));

router.use('/', allowCORS);
router.use('/', disableCache);
router.use('/v1/', v1Router);

function allowCORS(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
}

function disableCache(req, res, next) {
    res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", 0);
    next();
}
module.exports = router;