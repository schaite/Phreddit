const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        maxlength: 50, 
    },
    lastName: {
        type: String,
        maxlength: 50,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    reputation: {
        type: Number,
        default: 100,
    },
});

userSchema.virtual('url').get(function (){
    return `users/${this._id}`;
});

module.exports = mongoose.model('User', userSchema);
