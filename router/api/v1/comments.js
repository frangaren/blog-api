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

router.patch('/:id', existsComment);
router.patch('/:id', existsAuthor);
router.patch('/:id', existsPost);
router.patch('/:id', updateComment);

router.delete('/:id', existsComment);
router.delete('/:id', deleteComment);

function listComments(req, res, next) {
    const worker = req.app.get('worker-proxy');
    worker.comments.list()
        .then(reply => res.json(reply))
        .catch(error => next(error));
}

function createComment(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        post: req.body.post,
        author: req.body.author,
        text: req.body.text
    };
    worker.comments.create(args)
        .then(reply => res.status(201).json(reply))
        .catch(error => next(error));
}

function retrieveComment(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id
    };
    worker.comments.retrieve(args)
        .then(reply => res.json(reply))
        .catch(error => next(error));
}

function updateComment(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id,
        post: req.body.post,
        author: req.body.author,
        text: req.body.text
    }
    worker.comments.update(args)
        .then(reply => res.json(reply))
        .catch(error => next(error));
}

function deleteComment(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id
    };
    worker.comments.delete(args)
        .then(reply => res.json(reply))
        .catch(error => next(error));
}

function existsComment(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id
    };
    worker.comments.exists(args)
        .then(reply => {
            if (reply) {
                next();
            } else {
                let error = new Error('Comment Not Found');
                error.status = 404;
                next(error);
            }
        })
        .catch(error => next(error));
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
    } else {
        const worker = req.app.get('worker-proxy');
        const args = {
            id: req.body.author
        };
        worker.users.exists(args)
            .then(reply => {
                if (reply) {
                    next();
                } else {
                    let error = new Error('Comment Author Not Found');
                    error.status = 404;
                    next(error);
                }
            })
            .catch(error => next(error));
    }
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
    } else {
        const worker = req.app.get('worker-proxy');
        const args = {
            id: req.body.post
        };
        worker.posts.exists(args)
            .then(reply => {
                if (reply) {
                    next();
                } else {
                    let error = new Error('Comment Post Not Found');
                    error.status = 404;
                    next(error);
                }
            })
            .catch(error => next(error));
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