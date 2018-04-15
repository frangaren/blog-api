'use strict';

const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.list = async function (params) {
    const users = await User.find().exec();
    return users;
}

exports.retrieve = async function (params) {
    const user = await User.find({_id: params.id}).exec();
    return user;
}