import { getComments } from '../controllers/commentController';

const express = require('express');
const router = express.Router();

router.get('/comments', getComments);

module.exports = router;
