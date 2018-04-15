'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { fork } = require('child_process');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port);
