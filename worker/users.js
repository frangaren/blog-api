'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const saltRounds = 10;

exports.list = async function (args) {
    const users = await User.find().exec();
    return users;
}

exports.create = async function (args) {
    let user = new User();
    user.username = args.username;
    user.email = args.email;
    user.name = args.name;
    user.password = args.password;
    user = await user.save();
    return user;
}

exports.retrieveComments = async function (args) {
    const comments = await Comment.find({ author: args.id }).exec();
    return comments;
}

exports.retrievePosts = async function (args) {
    const posts = await Post.find({ author: args.id }).exec();
    return posts;
}

exports.retrieve = async function (args) {
    const user = await User.findById(args.id).exec();
    return user;
}

exports.update = async function (args) {
    let user = await User.findById(args.id).exec();
    user.username = args.username || user.username;
    user.email = args.email || user.email;
    user.name = args.name || user.name;
    user.password = args.password || user.password;
    user = await user.save();
    return user;
}

exports.delete = async function (args) {
    const user = await User.findByIdAndRemove(args.id).exec();
    await Post.find({author:user._id}).remove().exec();
    await Comment.find({author:user._id}).remove().exec();
    return user;
}

exports.exists = async function (args) {
    const user = await User.findById(args.id).exec();
    return user !== null;
}

exports.validateUsername = async function (args) {
    const regex = /^\w{3,16}$/gi;
    if (!regex.test(args.username)) {
        return {
            valid: false,
            tip: 'Username must match /^\\w{3,16}$/gi.'
        };
    } else {
        const user = await User.findOne({username: args.username}).exec();
        if (user != null && user._id != args.id) {
            return {
                valid: false,
                status: 409,
                tip: 'Username already taken.'
            };
        } else {
            return {
                valid: true
            }
        }
    }
}

exports.validateEmail = async function (args) {
    const regex = /^\w+@\w+\.\w+$/gi;
    if (!regex.test(args.email)) {
        return {
            valid: false,
            tip: 'Email must match /^\\w+@\\w+\\.\\w+$/gi.'
        };
    } else {
        const user = await User.findOne({ email: args.email }).exec();
        if (user != null && user._id != args.id) {
            return {
                valid: false,
                status: 409,
                tip: 'Email already taken.'
            };
        } else {
            return {
                valid: true
            }
        }
    }
}

exports.validatePassword = async function (args) {
    const lowercaseLetters = /[a-z]/g.test(args.password);
    const uppercaseLetters = /[A-Z]/g.test(args.password);
    const numbers = /[0-9]/g.test(args.password);
    const symbols = /[^A-Z0-9a-z]/g.test(args.password);
    const length = args.password.length;
    if (lowercaseLetters && uppercaseLetters && numbers && symbols && length >= 8) {
        return {
            valid: true
        };
    } else {
        return {
            valid: false,
            tip: 'Passwords must have at least 8 characters: 1 lowercase ' + 
                 'letter, 1 uppercase letter, 1 number and 1 symbol.'
        };
    }
}

exports.hashPassword = async function (args) {
    let hashed = await bcrypt.hash(args.password, saltRounds);
    return hashed;
}