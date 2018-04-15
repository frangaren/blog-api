'use strict';

const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.list = async function (args) {
    const users = await User.find().exec();
    return users;
}

exports.create = async function (args) {
    let user = new User();
    user.username = args.username;
    user.password = args.password;
    user = await user.save();
    return user;
}

exports.retrieve = async function (args) {
    const user = await User.findById(args.id).exec();
    return user;
}

exports.update = async function (args) {
    let user = await User.findById(args.id).exec();
    user.username = args.username || user.username;
    user.password = args.password || user.password;
    user = await user.save();
    return user;
}

exports.delete = async function (args) {
    const user = await User.findByIdAndRemove(args.id).exec();
    return user;
}