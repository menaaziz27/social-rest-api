import {
	getPosts,
	createPost,
	editPost,
	deletePost,
	getMyPosts,
	likePost,
	unLikePost,
	getPostById,
} from '../controllers/postController';
import isAuth from '../middlewares/isAuth';

const express = require('express');
const router = express.Router();

router.route('/me').get(isAuth(), getMyPosts);
router.route('/').get(isAuth(), getPosts).post(isAuth(), createPost);

router.route('/:postId').put(isAuth(), editPost).delete(isAuth(), deletePost).get(isAuth(), getPostById);

router.route('/:postId/like').put(isAuth(), likePost);
router.route('/:postId/unlike').put(isAuth(), unLikePost);

module.exports = router;
