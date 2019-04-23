
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const debug = require('debug')('app:blog');
const path = require('path');

const postRouter = require('./routes/posts');
const singupRouter = require('./routes/user');


const app = express();

mongoose.connect("mongodb+srv://nahid597:u9QyXKv0beIIfVCL@blog-a9ovy.mongodb.net/blog?retryWrites=true", { useNewUrlParser: true })
    .then(() => {
        debug('mongdb is connected...');
    })
    .catch((err) => {
        debug('Error is occured..' + err);
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use("/images",express.static(path.join("backend/images")));


app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");

    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    res.setHeader("Access-Control-Allow-Methods",
        "GET,POST, PATCH, PUT, DELETE, OPTIONS");

    next();
});

app.use('/api/posts', postRouter);
app.use('/api/user', singupRouter);

// /home/nahid/program/MEAN/Messenger/backend/images/screenshot-from-2019-02-22-23-53-16.png-1555446221971.png


module.exports = app;