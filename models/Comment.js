const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    text: String,
    image: String,
    creatorName: String,
    creatorImage: String,
    creatorEmail: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
    likes: {
        type: [String],
        default: [],
    },
});

var PostComment = mongoose.model('PostComment', postSchema);
module.exports =  {PostComment};
