import { getPostComments, createComment, editComment, deleteComment } from '../controllers/commentController';
import isAuth from '../middlewares/isAuth';

const express = require('express');
const router = express.Router({ mergeParams: true });

router.route('/').get(isAuth(), getPostComments).post(isAuth(), createComment);

module.exports = router;
