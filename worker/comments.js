'use strict';

const mongoose = require('mongoose');

const Comment = mongoose.model('Comment');

exports.list = async function (args) {
    const comments = await Comment.find().exec();
    return comments;
}

exports.create = async function (args) {
    let comment = new Comment();
    comment.post = args.post;
    comment.author = args.author;
    comment.creationDate = args.creationDate;
    comment.text = args.text;
    comment = await comment.save();
    return comment;
}

exports.retrieve = async function (args) {
    const comment = await Comment.findById(args.id).exec();
    return comment;
}

exports.update = async function (args) {
    let comment = await Comment.findById(args.id).exec();
    comment.post = args.post || comment.post;
    comment.author = args.author || comment.author;
    comment.text = args.text || comment.text;
    comment = await comment.save();
    return comment;
}