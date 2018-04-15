'use strict';

const express = require('express');

const router = express.Router();

router.get('/', listUsers);
router.get('/:id', retrieveUser);

function listUsers(req, res, next) {
    const worker = req.app.get('worker');
    worker.once('message', function(msg) {
        if (msg.success) {
            res.json(msg.reply);
        } else {
            next(msg.error);
        }
    });
    worker.send({
        module: 'users',
        function: 'list',
        args: {}
    });
}

function retrieveUser(req, res, next) {
    const worker = req.app.get('worker');
    worker.once('message', function (msg) {
        if (msg.success) {
            res.json(msg.reply);
        } else {
            next(msg.error);
        }
    });
    worker.send({
        module: 'users',
        function: 'retrieve',
        args: {
            id: req.params.id
        }
    });    
}

module.exports = router;