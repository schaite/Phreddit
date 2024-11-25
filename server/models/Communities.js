// Community Document Schema
const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
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
    members: {
        type:[{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }],
        required: true,
        validate: [arrayLimit, '{PATH} must have at least one member']
    },
    memberCount:{
        type: Number,
        default: 0
    }
});

function arrayLimit(val){
    return val.length > 0;
}

communitySchema.virtual('url').get(function () {
    return `communities/${this.id}`;
});

module.exports = mongoose.model('Community', communitySchema);