
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const debug = require('debug')('app:blog');

const postRouter = require('./routes/posts');


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


app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");

    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept ");

    res.setHeader("Access-Control-Allow-Methods",
        "GET,POST, PATCH, PUT, DELETE, OPTIONS");

    next();
});

app.use('/api/posts', postRouter);




module.exports = app;