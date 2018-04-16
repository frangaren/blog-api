'use strict';

const express = require('express');

const router = express.Router();

router.get('/', listUsers);
router.post('/', createUser);
router.get('/:id', existsUser);
router.get('/:id', retrieveUser);
router.put('/:id', existsUser);
router.put('/:id', updateUser);
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
            res.json(msg.reply);
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
        console.log(msg);
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

module.exports = router;