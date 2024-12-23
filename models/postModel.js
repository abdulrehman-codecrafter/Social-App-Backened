const mongoose = require('mongoose');
// const Comment = require('./commentModel');

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
},{ timestamps: true})



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
    comments:[commentSchema],
},{ timestamps: true })

const Post = mongoose.model('Post',postSchema);

module.exports=Post;