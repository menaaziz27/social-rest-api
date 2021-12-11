import { deleteComment, editComment, getUserComments } from '../controllers/commentController';
import isAuth from '../middlewares/isAuth';
import { commentValidation } from '../validation/commentValidation';

const express = require('express');
const router = express.Router({ mergeParams: true });

router.route('/').get(isAuth(), getUserComments);
router.route('/:commentId').put(isAuth(), commentValidation, editComment).delete(isAuth(), deleteComment);

module.exports = router;
