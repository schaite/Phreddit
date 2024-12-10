// Comment Document Schema
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
        maxlength: 500,
    },
    commentIDs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    commentedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    commentedDate:{
        type: Date,
        default:Date.now,
        required:true
    },
    vote:{
        type: Number,
        required: true,
        default: 0,
    }
});

commentSchema.virtual('url').get(function () {
    return `comments/${this._id}`;
});

module.exports = mongoose.model('Comment', commentSchema);