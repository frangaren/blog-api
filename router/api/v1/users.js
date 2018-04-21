'use strict';

const express = require('express');

const router = express.Router();

router.get('/', listUsers);

router.post('/', requireUsername);
router.post('/', requirePassword);
router.post('/', validateUsername);
router.post('/', validatePassword);
router.post('/', hashPassword);
router.post('/', createUser);

router.get('/:id/comments', existsUser);
router.get('/:id/comments', retrieveUserComments);

router.get('/:id', existsUser);
router.get('/:id', retrieveUser);

router.patch('/:id', existsUser);
router.patch('/:id', validateUsername);
router.patch('/:id', validatePassword);
router.patch('/:id', hashPassword);
router.patch('/:id', updateUser);

router.delete('/:id', existsUser);
router.delete('/:id', deleteUser);

function listUsers(req, res, next) {
    const worker = req.app.get('worker');
    worker.once('message', function(msg) {
        if (msg.success) {
            res.json(msg.reply);
        } else {
            next(msg.error);
        }
    });
    worker.send({
        module: 'users',
        function: 'list',
        args: {}
    });
}

function createUser(req, res, next) {
    const worker = req.app.get('worker');
    worker.once('message', function (msg) {
        if (msg.success) {
            res.status(201).json(msg.reply);
        } else {
            next(msg.error);
        }
    });
    worker.send({
        module: 'users',
        function: 'create',
        args: {
            username: req.body.username,
            password: req.body.password
        }
    });
}

function retrieveUserComments(req, res, next) {
    const worker = req.app.get('worker');
    worker.once('message', function (msg) {
        if (msg.success) {
            res.json(msg.reply);
        } else {
            next(msg.error);
        }
    });
    worker.send({
        module: 'users',
        function: 'retrieveComments',
        args: {
            id: req.params.id
        }
    });
}

function retrieveUser(req, res, next) {
    const worker = req.app.get('worker');
    worker.once('message', function (msg) {
        if (msg.success) {
            res.json(msg.reply);
        } else {
            next(msg.error);
        }
    });
    worker.send({
        module: 'users',
        function: 'retrieve',
        args: {
            id: req.params.id
        }
    });    
}

function updateUser(req, res, next) {
    const worker = req.app.get('worker');
    worker.once('message', function (msg) {
        if (msg.success) {
            res.json(msg.reply);
        } else {
            next(msg.error);
        }
    });
    worker.send({
        module: 'users',
        function: 'update',
        args: {
            id: req.params.id,
            username: req.body.username,
            password: req.body.password
        }
    });
}

function deleteUser(req, res, next) {
    const worker = req.app.get('worker');
    worker.once('message', function (msg) {
        if (msg.success) {
            res.json(msg.reply);
        } else {
            next(msg.error);
        }
    });
    worker.send({
        module: 'users',
        function: 'delete',
        args: {
            id: req.params.id
        }
    });
}

function existsUser(req, res, next) {
    const worker = req.app.get('worker');
    worker.once('message', function (msg) {
        if (msg.success) {
            if (msg.reply) {
                next();
            } else {
                let error = new Error('User Not Found');
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
            id: req.params.id
        }
    });
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
        const worker = req.app.get('worker');
        worker.once('message', function (msg) {
            if (msg.success) {
                if (msg.reply.valid) {
                    next();
                } else {
                    let error = new Error(`Invalid Username: ${msg.reply.tip}`);
                    error.status = msg.reply.status || 422;
                    next(error);
                }
            } else {
                next(msg.error);
            }
        });
        worker.send({
            module: 'users',
            function: 'validateUsername',
            args: {
                id: req.params.id,
                username: req.body.username
            }
        });
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
        const worker = req.app.get('worker');
        worker.once('message', function (msg) {
            if (msg.success) {
                if (msg.reply.valid) {
                    next();
                } else {
                    let error = new Error(`Invalid Password: ${msg.reply.tip}`);
                    error.status = 422;
                    next(error);
                }
            } else {
                next(msg.error);
            }
        });
        worker.send({
            module: 'users',
            function: 'validatePassword',
            args: {
                password: req.body.password
            }
        });
    }
}

function hashPassword(req, res, next) {
    if (!('password' in req.body)) {
        next();
    } else {
        const worker = req.app.get('worker');
        worker.once('message', function (msg) {
            if (msg.success) {
                req.body.password = msg.reply;
                next();
            } else {
                next(msg.error);
            }
        });
        worker.send({
            module: 'users',
            function: 'hashPassword',
            args: {
                password: req.body.password
            }
        });
    }
}

module.exports = router;