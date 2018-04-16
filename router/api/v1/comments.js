'use strict';

const express = require('express');

const router = express.Router();

router.get('/', listComments);

function listComments(req, res, next) {
    const worker = req.app.get('worker');
    worker.once('message', function (msg) {
        if (msg.success) {
            res.json(msg.reply);
        } else {
            next(msg.error);
        }
    });
    worker.send({
        module: 'comments',
        function: 'list',
        args: {}
    });
}

module.exports = router;