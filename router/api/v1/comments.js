'use strict';

const express = require('express');

const router = express.Router();

router.get('/', listComments);

router.post('/', requireAuthor);
router.post('/', requirePost);
router.post('/', requireText);
router.post('/', existsAuthor);
router.post('/', existsPost);
router.post('/', createComment);

router.get('/:id', existsComment);
router.get('/:id', retrieveComment);

router.put('/:id', existsComment);
router.put('/:id', existsAuthor);
router.put('/:id', existsPost);
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

function requireAuthor(req, res, next) {
    if (!('author' in req.body)) {
        let error = new Error('Author Not Provided');
        error.status = 422;
        next(error);
    } else {
        next();
    }
}

function existsAuthor(req, res, next) {
    if (!('author' in req.body)) {
        next();
    }
    const worker = req.app.get('worker');
    worker.once('message', function (msg) {
        if (msg.success) {
            if (msg.reply) {
                next();
            } else {
                let error = new Error('Comment Author Not Found');
                error.status = 404;
                next(error);
            }
        } else {
            next(msg.error);
        }
    });
    worker.send({
        module: 'users',
        function: 'exists',
        args: {
            id: req.body.author
        }
    });
}

function requirePost(req, res, next) {
    if (!('post' in req.body)) {
        let error = new Error('Post Not Provided');
        error.status = 422;
        next(error);
    } else {
        next();
    }
}

function existsPost(req, res, next) {
    if (!('post' in req.body)) {
        next();
    }
    const worker = req.app.get('worker');
    worker.once('message', function (msg) {
        if (msg.success) {
            if (msg.reply) {
                next();
            } else {
                let error = new Error('Post Not Found');
                error.status = 404;
                next(error);
            }
        } else {
            next(msg.error);
        }
    });
    worker.send({
        module: 'posts',
        function: 'exists',
        args: {
            id: req.body.post
        }
    });
}

function requireText(req, res, next) {
    if (!('text' in req.body)) {
        let error = new Error('Text Not Provided');
        error.status = 422;
        next(error);
    } else {
        next();
    }
}

module.exports = router;