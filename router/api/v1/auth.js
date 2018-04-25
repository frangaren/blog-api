'use strict';

const express = require('express');

const router = express.Router();

router.post('/token', checkGrantType);
router.post('/token', passwordAuthenticate);
router.post('/token', refreshAuthenticate);
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
    if (req.body.grant_type && req.body.grant_type === 'password') {
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

function refreshAuthenticate(req, res, next) {
    if (req.body.grant_type && req.body.grant_type === 'refresh_token') {
        const worker = req.app.get('worker-proxy');
        const args = {
            refreshToken: req.body.refresh_token,
            ip: req.connection.remoteAddress
        };
        worker.auth.refreshAuthenticate(args)
            .then(reply => {
                if (reply.valid) { // Good credentials
                    req.body._id = reply._id;
                    next();
                } else { // Wrong credentials
                    const error = {
                        error: 'invalid_grant',
                        error_description: 'Invalid refresh token.'
                    };
                    res.status(400).json(error);
                }
            })
            .catch(error => next(error));
    } else {
        next();
    }    
}

function checkGrantType(req, res, next) {
    const validGrantTypes = ['password', 'refresh_token'];
    if (validGrantTypes.indexOf(req.body.grant_type) < 0) {
        const error = {
            error: 'unsupported_grant_type',
            error_description: 'Invalid grant type.'
        };
        res.status(400).json(error);
    } else {
        next();
    }
}

module.exports = router;