const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    userName: String,
    email: {type: String, required: true},
    password: {type: String,},
    image: String,
    follows: {
        type: [String],
        default: [],
    },
    token: String,
    
});

var UserAccount = mongoose.model('UserAccount', userSchema);
module.exports = {UserAccount}

