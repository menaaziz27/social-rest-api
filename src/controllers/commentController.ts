import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Comment } from '../entities/Comment.entity';
import { Post } from '../entities/Post.entity';
import { asyncHandler } from '../middlewares/asyncHandler';

export const getComments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	let comments = await getRepository(Comment).find({});
	res.json(comments);
});

// /api/posts/:postId/comments
export const createComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { postId } = req.params;
	const { text } = req.body;

	let post = await getRepository(Post).findOne({ where: { id: +postId } });
	if (!post) {
		res.status(400);
		throw new Error('Post is not exist');
	}

	let newComment = await getRepository(Comment).create({
		text,
		post,
	});
	await newComment.save();

	res.status(201).json({ comment: newComment });
});

export const editComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {});

export const deleteComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {});
