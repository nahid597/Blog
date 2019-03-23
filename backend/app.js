
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const debug = require('debug')('app:blog');

const Post = require('./models/post');

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
        "GET,POST, PATCH, DELETE, OPTIONS");

    next();
});

app.post('/api/posts', (req, res, next) => {

    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });

    post.save()
    .then((result) => {
        res.status(201).json({
            message: "Post successfully send from server...",
            postId : result._id
        });
    });

   
});

app.get('/api/posts', (req, res, next) => {

    Post.find()
        .then((documents) => {
            res.status(200).json({
                message: 'patch data successfully',
                posts: documents
            });
        });

    // next();
});

app.delete('/api/posts/:id', (req, res) => {
    Post.deleteOne({_id:req.params.id})
    .then((result) => {
        //console.log(result);
        res.status(200).json({
            message: 'Delete successfully'
        });
    });
    
});


module.exports = app;