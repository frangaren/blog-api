'use strict';

const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const userSchema = mongoose.Schema({
    username: String,
    password: String
});

userSchema.path('username').required(true).unique(true);
userSchema.path('password').required(true);

const User = mongoose.model('User', userSchema);

module.exports = User;