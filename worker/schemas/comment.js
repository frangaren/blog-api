'use strict';

const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    creationDate: Date,
    text: String
});

commentSchema.path('post').required(true);
commentSchema.path('author').required(true);
commentSchema.path('creationDate').default(Date.now);
commentSchema.path('text').required(true);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;