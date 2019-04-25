
 const express = require('express');
 const bcryptjs = require('bcryptjs');
 const jwt = require('jsonwebtoken');

 const router = express.Router();

 const User = require('../models/user');


 router.post('/signup', (req, res, next) => {
    //console.log("email= " + req.body.email);
    //console.log("password= " + req.body.password);
    
    bcryptjs.hash(req.body.password, 10)
    .then(hash => {
       const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(result => {
            res.status(200).json({
                message: 'user created',
                result: result
            });
        })
        .catch(err => {
            res.status(201).json({
                error: err,
            });
        });
    });
    
 });



 router.post('/login', (req, res , next) => {

    let fetchData;

    console.log("nahid");
   
    User.findOne({email: req.body.email})
    .then(user => {
        //console.log(user);
        if(!user)
        {
            return res.status(404).json({
                message: 'Auth failed!'
            });
        }

        fetchData = user;

       return bcryptjs.compare(req.body.password, fetchData.password);
    })
    .then(result => {
        if(!result)
        {
            return res.status(404).json({
                message: 'Auth failed!'
            });
        }

       const token = jwt.sign({email:req.body.email, userId: fetchData._id}, "secret_should_more_difficult" , {
            expiresIn: '1h'
        });
       
       // console.log(token);
       res.status(200).json({
           token: token,
           expiresIn: 3600,
           userId: fetchData._id,
       });


    })
    .catch(err => {
        //console.log(err);
        return res.status(404).json({
            message: 'Auth failed!'
        });
    });

});


module.exports = router;