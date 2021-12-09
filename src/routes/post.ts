import { getPosts, createPost, editPost, deletePost } from '../controllers/postController';

const express = require('express');
const router = express.Router();

router.post('/posts', createPost);
router.get('/posts', getPosts);
router.put('/posts/:id', editPost);
router.delete('/posts/:id', deletePost);

module.exports = router;
