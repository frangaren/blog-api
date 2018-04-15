'use strict';

const express = require('express');

const router = express.Router();

router.get('/', listPosts);
router.post('/', createPost);
router.get('/:id', retrievePost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

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

function updatePost(req, res, next) {
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
        function: 'update',
        args: {
            id: req.params.id,
            title: req.body.title,
            text: req.body.text
        }
    });
}

function deletePost(req, res, next) {
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
        function: 'delete',
        args: {
            id: req.params.id
        }
    });
}

module.exports = router;