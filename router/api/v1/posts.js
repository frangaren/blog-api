'use strict';

const express = require('express');

const router = express.Router();

router.get('/', listPosts);

router.post('/', checkAuthentication);
//router.post('/', requireAuthor);
router.post('/', requireTitle);
router.post('/', requireText);
//router.post('/', existsAuthor);
router.post('/', createPost);

router.get('/:id/comments', existsPost);
router.get('/:id/comments', retrievePostComments);

router.get('/:id', existsPost);
router.get('/:id', retrievePost);

router.patch('/:id', checkAuthentication);
router.patch('/:id', checkPermission);
router.patch('/:id', existsPost);
//router.patch('/:id', existsAuthor);
router.patch('/:id', updatePost);

router.delete('/:id', checkAuthentication);
router.delete('/:id', checkPermission);
router.delete('/:id', existsPost);
router.delete('/:id', deletePost);

function listPosts(req, res, next) {
    const worker = req.app.get('worker-proxy');
    worker.posts.list()
        .then(reply => res.json(reply))
        .catch(error => next(error));
}

function createPost(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        title: req.body.title,
        text: req.body.text,
        author: req.body.authorizedUser
    };
    worker.posts.create(args)
        .then(reply => res.status(201).json(reply))
        .catch(error => next(error));
}

function retrievePostComments(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id        
    };
    worker.posts.retrieveComments(args)
        .then(reply => res.json(reply))
        .catch(error => next(error));
}

function retrievePost(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id
    };
    worker.posts.retrieve(args)
        .then(reply => res.json(reply))
        .catch(error => next(error));
}

function updatePost(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id,
        title: req.body.title,
        text: req.body.text
        //author: req.body.author
    };
    worker.posts.update(args)
        .then(reply => res.json(reply))
        .catch(error => next(error));
}

function deletePost(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id
    };
    worker.posts.delete(args)
        .then(reply => res.json(reply))
        .catch(error => next(error));
}

function existsPost(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id
    };
    worker.posts.exists(args)
        .then(reply => {
            if (reply) {
                next();
            } else {
                let error = new Error('Post Not Found');
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
                    let error = new Error('Post Author Not Found');
                    error.status = 404;
                    next(error);
                }                
            })
            .catch(error => next(error));
    }
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

function checkAuthentication(req, res, next) {
    if (!req.headers.authorization) {
        const error = new Error('HTTP authorization header required.');
        error.status = 401;
        next(error);
    } else {
        const parts = req.headers.authorization.split(' ');
        if (parts[0] !== 'Bearer') {
            const error = new Error('HTTP authorization must be a Bearer token');
            error.status = 401;
            next(error);
        } else {
            const worker = req.app.get('worker-proxy');
            const args = {
                accessToken: parts[1],
                ip: req.connection.remoteAddress
            };
            worker.auth.checkAccessToken(args)
                .then(reply => {
                    if (reply.valid) {
                        req.body.authorizedUser = reply._id;
                        next();
                    } else {
                        const error = new Error('Invalid access token.');
                        error.status = 401;
                        next(error);
                    }
                })
                .catch(error => next(error));
        }
    }
}

function checkPermission(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id
    };
    worker.posts.retrieve(args)
        .then(reply => {
            if (reply.author === req.body.authorizedUser) {
                next();
            } else {
                const error = new Error('You don\'t have permission over this post.');
                error.status = 401;
                next(error);
            }
        })
        .catch(error => next(error));
}

module.exports = router;