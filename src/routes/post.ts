import { Request, Response } from 'express';
import { Post } from '../entities/Post.entity';
import { asyncHandler } from '../middlewares/asyncHandler';
import { getPosts } from '../controllers/PostController';

const express = require('express');
const router = express.Router();

router.get('/posts', getPosts);

module.exports = router;
