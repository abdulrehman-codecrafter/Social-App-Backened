const express = require('express');
const { fetchPosts, createPost, fetchSinglePost, deletePost, updatePost, fetchComments } = require('../controllers/postControllers');
const authVerify = require('../middlewares/auth');
const postRouter = express.Router();


postRouter.get('/',fetchPosts)
postRouter.get('/:id',authVerify,fetchSinglePost)
postRouter.post('/create',authVerify,createPost)
postRouter.put('/update',authVerify,updatePost)
postRouter.delete('/delete/:id',authVerify,deletePost)
postRouter.get('/comments/:id',authVerify,fetchComments)
module.exports=postRouter;