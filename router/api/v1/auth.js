'use strict';

const express = require('express');

const router = express.Router();

router.post('/token', passwordAuthenticate);
router.post('/token', issueToken);

function issueToken (req, res, next) {
    const worker = req.app.get('worker-proxy');
    const args = {
        _id: req.body._id,
        ip: req.connection.remoteAddress
    };
    worker.auth.issueToken(args)
        .then(reply => res.json(reply))
        .catch(error => next(error));
}

function passwordAuthenticate (req, res, next) {
    if (req.query.grant_type && req.query.grant_type === 'password') {
        const worker = req.app.get('worker-proxy');
        const args = {
            username: req.body.username,
            password: req.body.password
        };
        worker.auth.passwordAuthenticate(args)
            .then(reply => {
                if (reply.valid) { // Good credentials
                    req.body._id = reply._id;
                    next();
                } else { // Wrong credentials
                    const error = {
                        error: 'invalid_grant',
                        error_description: 'Invalid username and password.'
                    };
                    res.status(400).json(error);
                }
            })
            .catch(error => next(error));
    } else {
        next();
    }
}

module.exports = router;