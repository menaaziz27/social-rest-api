import { getPostComments, createComment } from '../controllers/commentController';
import isAuth from '../middlewares/isAuth';
import { commentValidation } from '../validation/commentValidation';

const express = require('express');
const router = express.Router({ mergeParams: true });

router.route('/').get(isAuth(), getPostComments).post(isAuth(), commentValidation, createComment);

module.exports = router;
