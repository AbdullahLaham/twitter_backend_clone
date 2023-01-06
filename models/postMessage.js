const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    text: String,
    creatorName: String,
    creatorImage: String,
    creatorEmail: String,
    Image: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
    likes: {
        type: [String],
        default: [],
    },

    comments: {
        type: [Object],
        default: [],
    },
    
//     comments: {
//         type: [mongoose.Schema.Types.ObjectId],
//         ref: 'PostComment',
//    }
});

var PostMessage = mongoose.model('PostMessage', postSchema);
module.exports =  {PostMessage};
