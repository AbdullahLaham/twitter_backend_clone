const { default: mongoose } = require("mongoose");
const {PostMessage} = require("../models/postMessage");
const { UserAccount } = require("../models/user");

const randomId = require('random-id');
const createPost = async (req, res) => {
    const post = req.body;
    const newPostMessage = new PostMessage({...post, createdAt: new Date().toISOString()});
    try {
        await newPostMessage.save();
        res.status(200).json(newPostMessage);
    }
    catch(err) {
        res.status(409).json({message: err.message});
    }
}
const getPosts = async (req, res) => {
    try {
        const {userEmail} = req.body;
        const currentUser = await UserAccount.findOne({userEmail});
        console.log(currentUser);
        const posts = await PostMessage.find({$or: [{creatorEmail: userEmail}, {creatorEmail: {$in: currentUser?.follows}}]});
        
        res.status(200).json(posts);
        
        
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }

}

const deletePost = async (req, res) => {
    try {
        
        const {id: _id} = req.params;
        console.log('deleted', _id)
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({message: 'no post with this is'});
        }
        await PostMessage.findByIdAndRemove(_id);
        res.status(200).send('deleted succesfully');
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }

}
const likePost = async (req, res) => {
    try {
        
        const {id: _id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({message: 'no post with this is'});
        }
        const post = await PostMessage.findById(_id);
        console.log('likeslikeslikeslikeslikeslikeslikes', post?.likes.length)
        if (post?.likes?.includes(String(req?.userId))) {
            post['likes'] = post?.likes.filter((like) => like !== String(req?.userId))
        } else {
            post['likes'].push(req?.userId);
        }
        console.log('likes', post?.likes.length)
        const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new: true});
        res.json(updatedPost);
        // post = {...post, likes: likes.map((like) => like == req.)}
    }
    catch (error) {
        console.log(error)
    }
}
const fetchPost = async (req, res) => {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send('No post with this id');
        }
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({message: error?.message});
    }
}
const commentPost = async (req, res) => {
    try {
        const comment = req?.body;
        comment['_id'] = randomId(25, 'aBsauy780');
        console.log(comment)
        const { id } = req?.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send('No post with this id');
        }
        let post = await PostMessage.findById(id);

        post['comments'].push({...comment, likes: [],});
        // post = {...post, comments: [...post?.comments, comment]}
        const newPost = await PostMessage.findByIdAndUpdate(id, post, {new: true,});
        res.status(200).json(newPost);
    }
    catch (error) {
        res.status(500).json({ message: error?.message });
    }
}
const likeComment = async (req, res) => {
    const {id, commentId} = req.params;
    let post = await PostMessage.findById(id);
    let comment;
    // console.log(post, 'ffffffffffff');
    for (let i = 0; i < post?.comments?.length; i++) {
        if (post?.comments[i]?._id == commentId) {
            comment  = post?.comments[i];
            if (!post?.comments[i]?.likes.includes(String(req?.userId))) {
                console.log('notExists');
                post['comments'] = post?.comments.map((comment) => comment?._id == commentId ? {...comment, likes: [...comment?.likes, String(req?.userId)]} : comment)
            } else {
                console.log('Exists')
                post['comments'] = post?.comments.map((comment) => comment?._id == commentId ? {...comment, likes: comment?.likes?.filter((like) => like != String(req?.userId))} : comment)
            }
        }
    }
    
    const ourPost = await PostMessage.findByIdAndUpdate(id, post, {new: true,});
    res.status(200).json(ourPost);
    console.log('fwwwwwwwwwww', post?.comments[2]?.likes, ourPost?.comments[2]?.likes, comment);
}
const deleteComment = async (req, res) => {
    try {
        
        const {id, commentId} = req.params;console.log('eeeeeeeeeeeeee',commentId);
        const post = await PostMessage.findById(id);
        let updatedComments = post?.comments?.filter((comment) => comment?._id != commentId);
        post['comments'] = updatedComments;
        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true,});
        res.status(200).json(updatedPost);
    }
    catch(error) {
        res.status(500).json({message: error?.message});
    }
}
module.exports = {createPost, getPosts, deletePost, likePost, fetchPost, commentPost, deleteComment, likeComment}
