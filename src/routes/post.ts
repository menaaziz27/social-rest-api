import { getPosts, createPost, editPost, deletePost } from '../controllers/postController';
import isAuth from '../middlewares/isAuth';

const express = require('express');
const router = express.Router();

router.route('/').get(isAuth(), getPosts).post(isAuth(), createPost);

router.route('/:postId').put(isAuth(), editPost).post(isAuth(), deletePost);

module.exports = router;
