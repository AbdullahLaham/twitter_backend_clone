const express = require("express");
const {getSearchedPost, getPosts, createPost, updatePost, deletePost, likePost, getPost, fetchPost, commentPost, likeComment, deleteComment} = require('../controllers/posts.js');
const {loginRequest, signupRequest, googleAuth, fetchUsers, followUser} = require('../controllers/users');
const {auth} = require('../middleware/auth.js'); 

const postRoutes = express.Router();
postRoutes.get('/', getPosts);
postRoutes.post('/', auth,  createPost);
postRoutes.delete('/:id', auth,  deletePost);
postRoutes.patch('/:id/likePost', auth,  likePost);
postRoutes.patch('/:id/commentPost', auth,  commentPost);
postRoutes.get(`/:id`, auth, fetchPost);
postRoutes.patch(`/:id/likeComment/:commentId`, auth, likeComment)
postRoutes.delete(`/:id/deleteComment/:commentId`, auth, deleteComment)

// router.patch('/:id/likePost', likePost);
// router.patch('/:id/commentPost/', commentPost);
const userRoutes = express.Router();
userRoutes.post('/login', loginRequest);
userRoutes.post('/signup', signupRequest);
userRoutes.post('/googleAuth', googleAuth);
userRoutes.get('/allUsers', fetchUsers);
userRoutes.get('/allUsers', fetchUsers);
userRoutes.post('/:followerId/followUser/:followedId', followUser);
 
// router.get('/:id', getPost)
// router.post('/', auth ,createPost);
// router.delete('/:id', auth ,deletePost);
// router.patch('/:id/likePost', auth ,likePost);
// router.patch('/:id/commentPost/', auth, commentPost);
module.exports = {userRoutes, postRoutes, };
