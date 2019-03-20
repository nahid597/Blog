
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use((req, res, next) => {
   
   res.setHeader("Access-Control-Allow-Origin", "*");

   res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept ");

    res.setHeader("Access-Control-Allow-Methods",
    "GET,POST, PATCH, DELETE, OPTIONS");

    next();
});

app.post('/api/posts', (req, res, next) => {
   
    const post = req.body;
    console.log(post);

    res.status(201).json({
        message: "Post successfully send from server..."
    });
});

app.get( '/api/posts',(req, res, next) => {
   
    const posts = [
        {
            id: "hfssadfsj22" ,
            title: 'first posrt' ,
            content: 'this is come form server'
        },

        {
            id: "hfssadfsj22",
            title: 'first posrt',
            content: 'this is come form server'
        },

        {
            id: "hfssadfsj22r",
            title: 'Third post',
            content: 'this is come form server'
        },

    ];
    res.status(200).json({
        message: 'patch data successfully',
        posts: posts
    });
   // next();
});


module.exports = app;