'use strict';

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: String,
    creationDate: Date,
    text: String,
    tags: [String],
    author: mongoose.Schema.Types.ObjectId
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;