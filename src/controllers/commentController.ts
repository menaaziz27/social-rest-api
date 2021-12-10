import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Comment } from '../entities/Comment.entity';
import { Post } from '../entities/Post.entity';
import { asyncHandler } from '../middlewares/asyncHandler';

// endpoint to get all user comments in a specific post
// /api/posts/:postId/comments?page=2&take=2
export const getComments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { postId } = req.params;

	let comments = await getRepository(Comment)
		.createQueryBuilder()
		.select('*')
		// @ts-ignore
		.where('user_id = :user_id', { user_id: req.user.id })
		.andWhere('post_id = :post_id', { post_id: +postId })
		.getRawMany();

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
		// @ts-ignore
		user: req.user,
		text,
		post,
	});
	await newComment.save();

	res.status(201).json({ comment: newComment });
});

export const editComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {});

// /api/posts/:postId/comments/:commentId
export const deleteComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { postId, commentId } = req.params;

	let post = await getRepository(Post).findOne({
		where: { id: +postId },
		relations: ['comments', 'comments.user'],
	});

	const existingComment = post?.comments.find(comment => comment?.id === +commentId);
	console.log({ existingComment });

	if (!existingComment) {
		res.status(400);
		throw new Error('Comment is not found');
	}

	// @ts-ignore
	if (existingComment.user.id !== req.user.id) {
		res.status(400);
		throw new Error('Not Authorized to perform this operation.');
	}

	// @ts-ignore
	post.comments = post?.comments?.filter(comment => +commentId !== comment.id);

	await post?.save();

	res.status(200).json(post);
});
