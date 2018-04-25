'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = mongoose.model('User');
const AccessToken = mongoose.model('AccessToken');

exports.issueToken = async function (args) {
    let entry = await AccessToken.findOne({user: args._id, ip: args.ip}).exec();
    if (!entry) {
        entry = new AccessToken();
        entry.user = args._id;
        entry.ip = args.ip;
    }
    const accessToken = await generateAccessToken();
    const refreshToken = await generateRefreshToken();
    entry.accessToken = accessToken;
    entry.refreshToken = refreshToken;
    entry.expirationDate = Date.now() + 36000000;
    entry = await entry.save();
    return {
        _id: entry.id, //DEBUG
        access_token: accessToken,
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: refreshToken
    };
}

async function generateRefreshToken() {
    let found = true;
    let token = "";
    do {
        token = await generateToken(128);
        let entry = await AccessToken.findOne({ refreshToken: token }).exec();
        if (entry && entry.expirationDate > Date.now()) {
            found = false;
            entry.remove();
        } else if (!entry) {
            found = false;
        }
    } while (found);
    return token;
}

async function generateAccessToken () {
    let found = true;
    let token = "";
    do {
        token = await generateToken(128);
        let entry = await AccessToken.findOne({accessToken: token}).exec();
        if (entry && entry.expirationDate > Date.now()) {
            found = false;
            entry.remove();
        } else if (!entry) {
            found = false;
        }
    } while (found);
    return token;
}

async function generateToken (size) {
    const tokenBytes = await crypto.randomBytes(size);
    const token = tokenBytes.toString('base64');
    return token;
}

exports.passwordAuthenticate = async function (args) {
    if (!args.username || !args.password) {
        return {
            valid: false
        };
    }
    const user = await User.findOne({username: args.username})
        .select('+password').exec();
    if (user == null) {
        return {
            valid: false
        };
    }
    const result = await bcrypt.compare(args.password, user.password);
    if (result) {
        return {
            valid: true,
            _id: user._id
        };
    } else {
        return {
            valid: false
        };
    }
}