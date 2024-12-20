const mongoose = require('mongoose');
const Comment = require('./commentModel');

const postSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    postImgUrl:{
        type:String,
        default:""
        // required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    comments:[Comment.commentSchema],
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
    
})

const Post = mongoose.model('Post',postSchema);

module.exports=Post;