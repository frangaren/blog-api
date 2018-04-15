'use strict';

const mongoose = require('mongoose');

const Post = mongoose.model('Post');

exports.list = async function (args) {
    const users = await Post.find().exec();
    return users;
}