'use strict';

const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    post: mongoose.Schema.Types.ObjectId,
    author: mongoose.Schema.Types.ObjectId,
    creationDate: Date,
    text: String
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;