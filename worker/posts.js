'use strict';

const mongoose = require('mongoose');

const Post = mongoose.model('Post');

exports.list = async function (args) {
    const posts = await Post.find().exec();
    return posts;
}

exports.create = async function (args) {
    let post = new Post();
    post.title = args.title;
    post.creationDate = args.creationDate;
    post.text = args.text;
    post.author = args.author;
    post = await post.save();
    return post;
}

exports.retrieve = async function (args) {
    const post = Post.findById(args.id).exec();
    return post;
}