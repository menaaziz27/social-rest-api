import { getPosts, createPost, editPost, deletePost } from '../controllers/postController';
import isAuth from '../middlewares/isAuth';

const express = require('express');
const router = express.Router();

router.post('/', isAuth(), createPost);

router.get('/', isAuth(), getPosts);

router.put('/:id', isAuth(), editPost);

router.delete('/:id', isAuth(), deletePost);

module.exports = router;
