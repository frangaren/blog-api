'use strict';

const mongoose = require('mongoose');

const accessTokenSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ip: String,
    expirationDate: Date,
    accessToken: String,
    refreshToken: String
});

accessTokenSchema.path('user').required(true);
accessTokenSchema.path('ip').required(true);
accessTokenSchema.path('expirationDate').default(() => Date.now() + 3600000);
accessTokenSchema.path('accessToken').required(true).unique(true);
accessTokenSchema.path('refreshToken').required(true).unique(true);

const AccessToken = mongoose.model('AccessToken', accessTokenSchema);

module.exports = AccessToken