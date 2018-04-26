'use strict';

const express = require('express');

const router = express.Router();

router.get('/', listUsers);

router.post('/', requireUsername);
router.post('/', requireEmail);
router.post('/', requireName);
router.post('/', requirePassword);
router.post('/', validateUsername);
router.post('/', validateEmail);
router.post('/', validatePassword);
router.post('/', hashPassword);
router.post('/', createUser);

router.get('/:id/comments', existsUser);
router.get('/:id/comments', retrieveUserComments);

router.get('/:id/posts', existsUser);
router.get('/:id/posts', retrieveUserPosts);

router.get('/:id', existsUser);
router.get('/:id', retrieveUser);

router.patch('/:id', checkAuthentication);
router.patch('/:id', existsUser);
router.patch('/:id', validateUsername);
router.patch('/:id', validateEmail);
router.patch('/:id', validatePassword);
router.patch('/:id', hashPassword);
router.patch('/:id', updateUser);

router.delete('/:id', checkAuthentication);
router.delete('/:id', existsUser);
router.delete('/:id', deleteUser);

function listUsers(req, res, next) {
    const worker = req.app.get('worker-proxy');
    worker.users.list()
        .then(reply => res.json(reply))
        .catch(error => next(error));
}

function createUser(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
    };
    worker.users.create(args)
        .then(reply => res.status(201).json(reply))
        .catch(error => next(error));
}

function retrieveUserComments(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id
    };
    worker.users.retrieveComments(args)
        .then(reply => res.json(reply))
        .catch(error => next(error));
}

function retrieveUserPosts(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id
    };
    worker.users.retrievePosts(args)
        .then(reply => res.json(reply))
        .catch(error => next(error));
}

function retrieveUser(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id
    };
    worker.users.retrieve(args)
        .then(reply => res.json(reply))
        .catch(error => next(error));   
}

function updateUser(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id,
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
    };
    worker.users.update(args)
        .then(reply => res.json(reply))
        .catch(error => next(error));
}

function deleteUser(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id,
    };
    worker.users.delete(args)
        .then(reply => res.json(reply))
        .catch(error => next(error));
}

function existsUser(req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        id: req.params.id
    };
    worker.users.exists(args)
        .then(reply => {
            if (reply) {
                next();
            } else {
                let error = new Error('User Not Found');
                error.status = 404;
                next(error);            
            }
        })
        .catch(error => next(error));
}

function requireUsername(req, res, next) {
    if (!('username' in req.body)) {
        let error = new Error('Username Not Provided');
        error.status = 422;
        next(error);
    } else {
        next();
    }
}

function validateUsername(req, res, next) {
    if (!('username' in req.body)) {
        next();
    } else {
        const worker = req.app.get('worker-proxy');
        const args = {
            id: req.params.id,
            username: req.body.username
        };
        worker.users.validateUsername(args)
            .then(reply => {
                if (reply.valid) {
                    next();
                } else {
                    let error = new Error(`Invalid Username: ${reply.tip}`);
                    error.status = reply.status || 422;
                    next(error);
                }
            })
            .catch(error => next(error));
    }
}

function requireEmail(req, res, next) {
    if (!('email' in req.body)) {
        let error = new Error('Email Not Provided');
        error.status = 422;
        next(error);
    } else {
        next();
    }
}

function validateEmail(req, res, next) {
    if (!('email' in req.body)) {
        next();
    } else {
        const worker = req.app.get('worker-proxy');
        const args = {
            id: req.params.id,
            email: req.body.email
        };
        worker.users.validateEmail(args)
            .then(reply => {
                if (reply.valid) {
                    next();
                } else {
                    let error = new Error(`Invalid Email: ${reply.tip}`);
                    error.status = reply.status || 422;
                    next(error);
                }
            })
            .catch(error => next(error));
    }
}

function requireName(req, res, next) {
    if (!('name' in req.body)) {
        let error = new Error('Name Not Provided');
        error.status = 422;
        next(error);
    } else {
        next();
    }
}

function requirePassword(req, res, next) {
    if (!('password' in req.body)) {
        let error = new Error('Password Not Provided');
        error.status = 422;
        next(error);
    } else {
        next();
    }
}

function validatePassword(req, res, next) {
    if (!('password' in req.body)) {
        next();
    } else {
        const worker = req.app.get('worker-proxy');
        const args = {
            id: req.params.id,
            password: req.body.password
        };
        worker.users.validatePassword(args)
            .then(reply => {
                if (reply.valid) {
                    next();
                } else {
                    let error = new Error(`Invalid Password: ${reply.tip}`);
                    error.status = 422;
                    next(error);
                }
            })
            .catch(error => next(error));
    }
}

function hashPassword(req, res, next) {
    if (!('password' in req.body)) {
        next();
    } else {
        const worker = req.app.get('worker-proxy');
        const args = {
            password: req.body.password
        }
        worker.users.hashPassword(args)
            .then(reply => {
                req.body.password = reply;
                next();
            })
            .catch(error => next(error));
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

module.exports = router;