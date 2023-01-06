const {UserAccount} = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PostMessage } = require('../models/postMessage');
const loginRequest = async (req, res) => {
    try {
        const {email, password} = req.body;
        // console.log(req.body);
        const account = await UserAccount.findOne({email: email});
        
        const isPasswordCorrect = await bcrypt.compare(password, account?.password);
        // console.log(account, isPasswordCorrect);
        if (account?.email) {
            if (isPasswordCorrect) {
                res.status(200).json(account);
            } else {
                res.status(400).json({message: 'password is not correct'});
            }
        } else res.status(400).json({message: 'there is no account with this email'});
    
    }
    catch(error) {
        // console.log(error);
    }
}
const signupRequest = async (req, res) => {
    const {name, email, password, confirmPassword, image} = req.body;
    const existedAccount = await UserAccount.findOne({email});
    if (!existedAccount?.email) {
        if (password !== confirmPassword) {
            return res.status(409).send({ message: "Password don't match"});
        }
        const cryptedPassword = await bcrypt.hash(password, 12);   
        const token = jwt.sign({email, password}, 'test', {expiresIn: '1h'});
        const newAccount = new UserAccount({userName: name, email, password: cryptedPassword, image, token});
        try {
            await newAccount.save();
            // console.log(newAccount);
            res.status(200).json(newAccount);
        }
        catch(error) {
            res.status(409).json({message: error.message});
        }
    } else {
        res.status(400).json({message: 'there is already account with the same email'});
    }
}
const googleAuth = async (req, res) => {
    const user = req.body;
    const {userName, email, image, token} = user;
    console.log(userName, email, image);
    const previousAccount = await UserAccount.findOne({email});
    console.log(previousAccount);
    // const token = jwt.sign({email}, 'test', {expiresIn: '1h'});
    try {
        if (previousAccount?.email) {
            const updatedAccount = {...previousAccount, token: token};
            const newAccount = await UserAccount.findByIdAndUpdate(previousAccount?._id, updatedAccount, {new: true});
            return res.status(200).json(newAccount);
        }
        else {
            const newAccount = new UserAccount({userName, email, image, token});
            await newAccount.save();
            // console.log(newAccount);
            res.status(200).json(newAccount);
        }
    }
    catch(error) {
        res.status(409).json({message: error.message});
    }
}
const fetchUsers = async (req, res) => {
    try {
        const users = await UserAccount.find();
        res.status(200).json(users);        
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
}
const followUser = async (req, res) => {
    try {
        const {followerId, followedId} = req.params;
        console.log(followerId, followedId)
        const followerUser = await UserAccount.findById(followerId);
        const followedUser = await UserAccount.findById(followedId);
        if (followerUser?.follows?.length) {
            if (followerUser.follows.includes(String(followedId))) {
                // unfollow user
                console.log('existed');
                followerUser['follows'] = followerUser.follows.filter(email => email != String(followedUser?.email));
            } else {
                // follow user
                followerUser['follows'].push(String(followedUser?.email));
            }
        } else {
            followerUser['follows']?.push(String(followedUser?.email))
        }
        
        
        const updatedUser = await UserAccount.findByIdAndUpdate(String(followerId), followerUser, {new: true,});
        console.log('rrrrrrrrrrrrrrr', updatedUser);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({message: error?.message});
    }

}

module.exports = {signupRequest, loginRequest, googleAuth, fetchUsers, followUser};
