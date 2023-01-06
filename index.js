
// import express from "express";
// import bodyParser, { urlencoded } from "body-parser";
// import mongoose from 'mongoose';
// import cors from 'cors';
const express = require('express');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { createPost } = require('./controllers/posts');
const {userRoutes, postRoutes } = require('./routes')
const app = express();
app.use(bodyParser.json({"limit": "30mb", extended: true})); // 30mb because we will send images
app.use(bodyParser.urlencoded({"limit": "30mb", extended: true}));
app.use(cors());
// app.get('/posts', (req, res) => res.send('helooooooooooooooooooooooooo'))
// app.post('/posts', createPost)

app.use('/posts', postRoutes);
app.use('/auth', userRoutes);

app.use('/', (req, res) => res.send('app is running'));

const CONNECTION_URL = 'mongodb+srv://abdullah:P3xklymrT5hwSm1U@cluster0.ooqvu2t.mongodb.net/?retryWrites=true&w=majority';
const PORT = 5000;
mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true,})
.then(() => {
    app.listen(PORT, () => console.log(`app is running on port ${PORT}`))
})
.catch((err) => {
    console.log(err.message);
})