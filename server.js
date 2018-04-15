'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { fork } = require('child_process');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
    let error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use(function (err, req, res, next) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    const reply = {
        status: status,
        message: message
    };
    res.status(status);
    res.json(reply);
});

app.listen(port);
