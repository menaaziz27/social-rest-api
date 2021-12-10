import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Comment } from '../entities/Comment.entity';
import { asyncHandler } from '../middlewares/asyncHandler';

export const getComments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	let comments = await getRepository(Comment).find({});
	res.json(comments);
});
