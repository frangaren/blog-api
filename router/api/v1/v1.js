'use strict';

const express = require('express');
const path = require('path');

const router = express.Router();
//const commentsRouter = require(path.join(__dirname, 'comments.js'));
//const postsRouter = require(path.join(__dirname, 'posts.js'));
const usersRouter = require(path.join(__dirname, 'users.js'));

//router.use('/comments/', commentsRouter);
//router.use('/posts/', postsRouter);
router.use('/users/', usersRouter);

module.exports = router;