'use strict';

const path = require('path');

const modules = {
    //'comments': require(path.join(__dirname, 'comments.js')),
    //'posts': require(path.join(__dirname, 'posts.js')),
    'users': require(path.join(__dirname, 'users.js'))
} 

process.on('message', function (msg) {
    process.send(modules[msg.module][msg.function](msg.args));
});