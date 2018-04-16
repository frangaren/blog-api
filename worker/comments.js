'use strict';

const mongoose = require('mongoose');

const Comment = mongoose.model('Comment');

exports.list = async function (args) {
    const comments = await Comment.find().exec();
    return comments;
}