import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Like } from '../entities/Like.entity';
import { Post } from '../entities/Post.entity';
import { asyncHandler } from '../middlewares/asyncHandler';

export const getMyPosts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	let [posts, count] = await getRepository(Post)
		// @ts-ignore
		.findAndCount({ where: { user: req.user.id }, relations: ['comments'] });

	res.json(posts);
});

export const getPosts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const take = Number(req?.query?.take) || 10;
	const page = Number(req?.query?.page) || 1;
	const skip = page === 1 ? 0 : (page - 1) * take;

	let posts = await getRepository(Post).find({ relations: ['likes', 'comments', 'user', 'likes.user'], skip, take });

	res.status(200).json(posts);
});

export const getPostById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { postId } = req.params;

	let post = await getRepository(Post).findOne({
		where: { id: postId },
		relations: ['comments', 'comments.user', 'likes', 'likes.user'],
	});

	res.status(200).json(post);
});

export const createPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { title, content } = req.body;
	let post = getRepository(Post).create({
		// @ts-ignore
		user: req.user,
		title,
		content,
	});

	await post.save();
	res.json(post);
});

export const editPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { postId } = req.params;
	let post = await getRepository(Post).findOne({
		where: { id: postId },
	});

	if (!post) {
		res.status(401);
		throw new Error('Post Not Fount!');
	}

	let updatedPost = await getRepository(Post).save({
		...post,
		...req.body,
	});

	res.json(updatedPost);
});

export const deletePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { postId } = req.params;
	let post = await getRepository(Post).findOne({ id: +postId }, { relations: ['user'] });

	// @ts-ignore
	if (req.user.id !== post?.user?.id) {
		res.status(400);
		throw new Error('You can only delete your posts');
	}

	await getRepository(Post).delete(+postId);

	res.json({ message: 'Post is deleted successfully.' });
});

// /api/posts/:postId/like
export const likePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { postId } = req.params;

	const post = await getRepository(Post).findOne({ where: { id: +postId }, relations: ['likes', 'likes.user'] });

	// @ts-ignore
	const existedLike = post?.likes.find(like => like.user.id === req.user.id);
	console.log(existedLike);

	let like;

	if (existedLike) {
		like = await getRepository(Like).save({
			...existedLike,
			is_like: true,
		});

		return res.status(201).json(like);
	} else {
		like = await getRepository(Like).create({
			// @ts-ignore
			user: req.user,
			// @ts-ignore
			post: post,
			is_like: true,
		});

		await like.save();

		return res.status(201).json(like);
	}
});

export const unLikePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	// @ts-ignore
	const { postId } = req.params;

	const post = await getRepository(Post).findOne({ where: { id: +postId }, relations: ['likes', 'likes.user'] });

	// @ts-ignore
	const existedLike = post?.likes.find(like => like.user.id === req.user.id);

	let like;

	if (existedLike) {
		like = await getRepository(Like).save({
			...existedLike,
			is_like: false,
		});
		return res.status(201).json(like);
	} else {
		like = await getRepository(Like).create({
			// @ts-ignore
			user: req.user,
			// @ts-ignore
			post: post,
			is_like: false,
		});

		await like.save();

		return res.status(201).json(like);
	}
});
