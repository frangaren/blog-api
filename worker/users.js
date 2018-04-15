'use strict';

const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.list = async function (args) {
    const users = await User.find().exec();
    return users;
}

exports.retrieve = async function (args) {
    const user = await User.find({_id: args.id}).exec();
    return user;
}

exports.create = async function (args) {
    let user = new User();
    user.username = args.username;
    user.password = args.password;
    user = await user.save();
    return user;
}