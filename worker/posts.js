'use strict';

const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

exports.list = async function (args) {
    const posts = await Post.find().sort('-creationDate').exec();
    return posts;
}

exports.create = async function (args) {
    let post = new Post();
    post.title = args.title;
    post.text = args.text;
    post.author = args.author;
    post = await post.save();
    return post;
}

exports.retrieveComments = async function (args) {
    const comments = await Comment.find({ post: args.id })
        .sort('-creationDate').exec();
    return comments;
}

exports.retrieve = async function (args) {
    const post = Post.findById(args.id).exec();
    return post;
}

exports.update = async function (args) {
    let post = await Post.findById(args.id).exec();
    post.title = args.title || post.title;
    post.text = args.text || post.text;
    post = await post.save();
    return post;
}

exports.delete = async function (args) {
    const post = await Post.findByIdAndRemove(args.id).exec();
    await Comment.find({post:post._id}).remove().exec();
    return post;
}

exports.exists = async function (args) {
    const post = await Post.findById(args.id).exec();
    return post !== null;
}