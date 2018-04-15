'use strict';

const express = require('express');

const router = express.Router();

router.get('/', listUsers);
router.post('/', createUser);
router.get('/:id', retrieveUser);
router.put('/:id', updateUser);
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

module.exports = router;