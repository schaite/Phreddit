// LinkFlair Document Schema
const mongoose = require('mongoose');

const linkFlairSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
        maxlength: 30,
    },
});

linkFlairSchema.virtual('url').get(function () {
    return `linkFlairs/${this._id}`;
});

module.exports = mongoose.model('linkFlair',linkFlairSchema);