import { deleteComment, editComment, getUserComments } from '../controllers/commentController';
import isAuth from '../middlewares/isAuth';

const express = require('express');
const router = express.Router({ mergeParams: true });

router.route('/').get(isAuth(), getUserComments);
router.route('/:commentId').put(isAuth(), editComment).delete(isAuth(), deleteComment);

module.exports = router;
