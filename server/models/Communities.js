// Community Document Schema
const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true,
        maxlength: 100
    },
    description:{
        type:String,
        required:true,
        maxlength: 500
    },
    postIDs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    startDate: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: {
        type:[{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }],
    },
    memberCount:{
        type: Number,
        default: 0
    }
});

communitySchema.virtual('url').get(function () {
    return `communities/${this.id}`;
});

module.exports = mongoose.model('Community', communitySchema);