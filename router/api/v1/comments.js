'use strict';

const express = require('express');

const router = express.Router();

router.get('/', listComments);
router.post('/', createComment);
router.get('/:id', existsComment);
router.get('/:id', retrieveComment);
router.put('/:id', existsComment);
router.put('/:id', updateComment);
router.delete('/:id', existsComment);
router.delete('/:id', deleteComment);

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
            text: req.body.text
        }
    });
}

function retrieveComment(req, res, next) {
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
        function: 'retrieve',
        args: {
            id: req.params.id
        }
    });
}

function updateComment(req, res, next) {
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
        function: 'update',
        args: {
            id: req.params.id,
            post: req.body.post,
            author: req.body.author,
            text: req.body.text
        }
    });
}

function deleteComment(req, res, next) {
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
        function: 'delete',
        args: {
            id: req.params.id
        }
    });
}

function existsComment(req, res, next) {
    const worker = req.app.get('worker');
    worker.once('message', function (msg) {
        console.log(msg);
        if (msg.success) {
            if (msg.reply) {
                next();
            } else {
                let error = new Error('Comment Not Found');
                error.status = 404;
                next(error);
            }
        } else {
            next(msg.error);
        }
    });
    
    worker.send({
        module: 'comments',
        function: 'exists',
        args: {
            id: req.params.id
        }
    });
}

module.exports = router;