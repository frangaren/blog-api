'use strict';

const mongoose = require('mongoose');

const Comment = mongoose.model('Comment');

const postSchema = mongoose.Schema({
    title: String,
    creationDate: Date,
    text: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

postSchema.path('title').required(true);
postSchema.path('creationDate').default(Date.now);
postSchema.path('text').required(true);
postSchema.path('author').required(true);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;