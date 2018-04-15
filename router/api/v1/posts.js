'use strict';

const express = require('express');

const router = express.Router();

router.get('/', listPosts);
router.post('/', createPost);
router.get('/:id', retrievePost);

function listPosts(req, res, next) {
    const worker = req.app.get('worker');
    worker.once('message', function (msg) {
        if (msg.success) {
            res.json(msg.reply);
        } else {
            next(msg.error);
        }
    });
    worker.send({
        module: 'posts',
        function: 'list',
        args: {}
    });
}

function createPost(req, res, next) {
    const worker = req.app.get('worker');
    worker.once('message', function (msg) {
        if (msg.success) {
            res.json(msg.reply);
        } else {
            next(msg.error);
        }
    });
    worker.send({
        module: 'posts',
        function: 'create',
        args: {
            title: req.body.title,
            creationDate: Date.now(),
            text: req.body.text,
            author: req.body.author
        }
    });
}

function retrievePost(req, res, next) {
    const worker = req.app.get('worker');
    worker.once('message', function (msg) {
        if (msg.success) {
            res.json(msg.reply);
        } else {
            next(msg.error);
        }
    });
    worker.send({
        module: 'posts',
        function: 'retrieve',
        args: {
            id: req.params.id
        }
    });
}

module.exports = router;