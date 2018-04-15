'use strict';

const express = require('express');

const router = express.Router();

router.get('/', listUsers);

function listUsers(req, res) {
    const worker = req.app.get('worker');
    worker.once('message', function(msg) {
        res.json(msg);
    });
    worker.send({
        module: 'users',
        function: 'list',
        args: {}
    });
}

module.exports = router;