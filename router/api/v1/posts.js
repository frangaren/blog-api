'use strict';

const express = require('express');

const router = express.Router();

router.get('/', listPosts);

router.post('/', requireAuthor);
router.post('/', requireTitle);
router.post('/', requireText);
router.post('/', existsAuthor);
router.post('/', createPost);

router.get('/:id', existsPost);
router.get('/:id', retrievePost);

router.put('/:id', existsPost);
router.put('/:id', existsAuthor);
router.put('/:id', updatePost);

router.delete('/:id', existsPost);
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

function existsPost(req, res, next) {
    const worker = req.app.get('worker');
    worker.once('message', function (msg) {
        console.log(msg);
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
                let error = new Error('Post Author Not Found');
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

function requireTitle(req, res, next) {
    if (!('title' in req.body)) {
        let error = new Error('Title Not Provided');
        error.status = 422;
        next(error);
    } else {
        next();
    }
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