import { getComments, createComment, editComment, deleteComment } from '../controllers/commentController';
import isAuth from '../middlewares/isAuth';

const express = require('express');
const router = express.Router({ mergeParams: true });

router.route('/').get(isAuth(), getComments).post(isAuth(), createComment);

router.route('/:commentId').put(isAuth(), editComment).delete(isAuth(), deleteComment);

module.exports = router;
