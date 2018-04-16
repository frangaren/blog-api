'use strict';

const express = require('express');

const router = express.Router();

router.get('/', listComments);
router.post('/', createComment);

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

function createComment(req, res, next) {
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
        function: 'create',
        args: {
            post: req.body.post,
            author: req.body.author,
            creationDate: Date.now(),
            text: req.body.text
        }
    });
}

module.exports = router;