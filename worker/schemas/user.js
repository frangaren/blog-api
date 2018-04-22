'use strict';

const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    name: String,
    password: String
});

userSchema.path('username').required(true).unique(true);
userSchema.path('email').required(true).unique(true);
userSchema.path('name').required(true);
userSchema.path('password').required(true).select(false);

const User = mongoose.model('User', userSchema);

module.exports = User;