import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Comment } from '../entities/Comment.entity';
import { Post } from '../entities/Post.entity';
import { asyncHandler } from '../middlewares/asyncHandler';

// /api/posts/:postId/comments
export const getPostComments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { postId } = req.params;

	console.log({ postId });
	const [comments, total] = await getRepository(Comment).findAndCount({
		where: { post: +postId },
		relations: ['user', 'post'],
	});

	res.status(200).json(comments);
});

export const getUserComments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	// @ts-ignore
	const comments = await getRepository(Comment).find({ where: { user: req.user.id } });

	res.status(200).json(comments);
});

// !DANGER
// endpoint to get all user comments in a specific post
// /api/posts/:postId/comments?page=2&take=2
export const getPostCommentsOfAUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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

// /api/comments/:commentId
export const editComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { commentId } = req.params;
	const { text } = req.body;

	const comment = await getRepository(Comment).findOne({ where: { id: +commentId }, relations: ['user'] });

	if (!comment) {
		res.status(404);
		throw new Error('Comment not found');
	}

	// @ts-ignore
	if (comment?.user?.id !== req.user.id) {
		res.status(400);
		throw new Error('Not authorized to perform this operation.');
	}

	const updatedComment = await getRepository(Comment).save({
		...comment,
		text,
	});

	res.status(201).json(updatedComment);
});

// /api/comments/:commentId
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
