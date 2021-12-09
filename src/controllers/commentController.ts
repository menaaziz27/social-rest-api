import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Comment } from '../entities/Comment.entity';
import { asyncHandler } from '../middlewares/asyncHandler';
// import { PostService } from '../services/Post.service';

export const getComments = asyncHandler(async (req: Request, res: Response, next: any) => {
	let comments = await getRepository(Comment).find({});
	res.json(comments);
});
