'use strict';

const path = require('path');
const mongoose = require('mongoose');

const dbUrl = process.env.DB_URL || 'mongodb://localhost/db';
const dbAuth = 'DB_AUTH' in process.env;
const dbAuthSource = (dbAuth) ? process.env.DB_AUTH_SOURCE : undefined;
const dbUser = (dbAuth) ? process.env.DB_USER : undefined;
const dbPassword = (dbAuth) ? process.env.DB_PASSWORD : undefined;
const connectionSettings = {
    user: dbUser,
    pass: dbPassword,
    authSource: dbAuthSource
};
mongoose.connect(dbUrl, connectionSettings);

mongoose.connection.on('error', console.error.bind(console, 'DB error: '));
mongoose.connection.once('open', function () {
    const Comment = require(path.join(__dirname, 'schemas', 'comment.js'));
    const Post = require(path.join(__dirname, 'schemas', 'post.js'));
    const User = require(path.join(__dirname, 'schemas', 'user.js'));

    const modules = {
        'comments': require(path.join(__dirname, 'comments.js')),
        'posts': require(path.join(__dirname, 'posts.js')),
        'users': require(path.join(__dirname, 'users.js'))
    };

    process.on('message', function (msg) {
        modules[msg.module][msg.function](msg.args)
        .then((reply) => {
            process.send({
                success: true,
                reply: reply
            });
        })
        .catch((error) => {
            process.send({
                success: false,
                error: error
            });
        });
    });
});

