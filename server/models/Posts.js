// Post Document Schema
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        maxlength: 100
    },
    content:{
        type: String,
        required: true,
    },
    linkFlairID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LinkFlair',
        default: null
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    postedDate:{
        type: Date,
        default: Date.now,
        required:true
    },      
    commentIDs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    views:{
        type:Number,
        required:true,
        default: 0
    }
});

postSchema.virtual('url').get(function (){
    return `posts/${this._id}`;
});

module.exports = mongoose.model('Post', postSchema); 