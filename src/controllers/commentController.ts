import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Comment } from '../entities/Comment.entity';
import { Post } from '../entities/Post.entity';
import { asyncHandler } from '../middlewares/asyncHandler';

// /api/posts/:postId/comments
export const getPostComments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { postId } = req.params;

	const [comments, total] = await getRepository(Comment).findAndCount({
		where: { post: +postId },
		relations: ['user', 'post'],
	});

	res.status(200).json(comments);
});

export const getUserComments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const take = Number(req?.query?.take) || 10;
	const page = Number(req?.query?.page) || 1;
	const skip = page === 1 ? 0 : (page - 1) * take;
	const comments = await getRepository(Comment).find({
		// @ts-ignore
		where: { user: req.user.id },
		relations: ['post', 'user'],
		skip,
		take,
	});

	res.status(200).json(comments);
});

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

	const comment = await getRepository(Comment).findOne({ where: { id: +commentId }, relations: ['user', 'post'] });

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

export const deleteComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { commentId } = req.params;

	// get comment with user relation
	// chech if

	const comment = await getRepository(Comment).findOne({ where: { id: +commentId }, relations: ['user'] });

	if (!comment) {
		res.status(404);
		throw new Error('Comment is not found');
	}
	// @ts-ignore
	if (comment?.user.id !== req.user.id) {
		// if comment is not mine
		res.status(400);
		throw new Error('Not Authorized to perform this operation.');
	}

	await getRepository(Comment).delete({ id: +commentId });

	res.status(200).json({ msg: 'comment is deleted' });
});
