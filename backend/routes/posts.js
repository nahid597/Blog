
const express = require('express');

const router = express.Router();

const Post = require('../models/post');

const multer = require('multer');

const cehckAuth = require('../middleware/check-auth');

// const mime_type_variable = {
//     'images/png': 'png',
//     'images/jpeg': 'jpg',
//     'images/jpg':'jpg'
// }

function getExtension (filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //const isValid = mime_type_variable[file.mimetype];
       // let error = new Error('Invalid mime type');

        // if(isValid)
        // {
        //     error = null;
        // }
        cb(null, 'backend/images');
    },
    filename:(req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = getExtension(name);
        cb(null, name + '-' + Date.now() + ext);
    }
})


router.post('', cehckAuth , multer({ storage: storage }).single("image"), (req, res, next) => {

    const url = req.protocol + '://' + req.get("host");
     
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator:req.userData.userId,
      
    });

    //console.log(req.userData);

    //res.status(200).json({});

    post.save()
    .then((result) => {
        res.status(201).json({
            message: "Post successfully send from server...",
            post : {
                ...result,
                id: result._id
            } 
        });
    });

   
});

router.get('', (req, res, next) => {
    
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let fetchedPosts;

    const postQuery = Post.find();

    if(pageSize && currentPage)
    {
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }


    postQuery
        .then((documents) => {
            fetchedPosts = documents;
            return Post.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'patch data successfully',
                posts: fetchedPosts,
                maxPosts: count
            });
        });

    // next();
});

router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id)
    .then(post => {
        if(post){
            res.status(200).json(post);
        } else{
            res.status(404).json({
                message: "Invalid id"
            });
        }
    })
});

router.put('/:id', cehckAuth, multer({ storage: storage }).single("image"), (req, res, next) => {

    let imagePath = req.body.imagePath;

    if(req.file){
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;

        // console.log(req.file.filename);

    }
    const post = new Post({
        _id:req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });

   // console.log(post);

    Post.updateOne({_id: req.params.id , creator: req.userData.userId}, post )
    .then(result => {
       // console.log(result);
       if(result.nModified > 0)
       {
            res.status(200).json("updated successfully!..");
       }
       else
       {
            res.status(401).json("unauthorized..");
       }
        
    });
});

router.delete('/:id', cehckAuth , (req, res, next) => {
    Post.deleteOne({_id:req.params.id, creator: req.userData.userId})
    .then((result) => {
        //console.log(result);

        if(result.n > 0)
       {
            res.status(200).json("delete successfully!..");
       }
       else
       {
            res.status(401).json("unauthorized..");
       }
    });
    
});

module.exports = router;