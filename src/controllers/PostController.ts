import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Like } from '../entities/Like.entity';
import { Post } from '../entities/Post.entity';
import { User } from '../entities/User.entity';
import { asyncHandler } from '../middlewares/asyncHandler';
// import { PostService } from '../services/Post.service';

export const getMyPosts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	console.log('here');
	let [posts, count] = await getRepository(Post)
		// @ts-ignore
		.findAndCount({ where: { user: req.user.id }, relations: ['comments'] });

	res.json(posts);
});

export const getPosts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const take = Number(req?.query?.take) || 10;
	const page = Number(req?.query?.page) || 1;
	const skip = page === 1 ? 0 : (page - 1) * take;

	// let [posts, count] = await getRepository(Post).findAndCount({
	// 	relations: ['user', 'comments', 'likes'],
	// 	loadEagerRelations: true,
	// 	take,
	// 	skip,
	// });

	let posts = await getRepository(Post).find({ relations: ['likes', 'comments', 'user'], skip, take });

	res.status(200).json(posts);
});

export const createPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	// @ts-ignore
	// let user = await getRepository(User).findByIds(req.user.id);
	// @ts-ignore
	console.log(req.user.id);
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
	// const { title, content } = req.body;
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
	// check if the currentUser has this post
	let post = await getRepository(Post).findOne({ id: +postId }, { relations: ['user'] });

	console.log({ post });
	// @ts-ignore
	console.log(req.user);
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
	console.log(post);
	// const like = await getRepository(Like).create({
	// 	// @ts-ignore
	// 	user: req.user,
	// 	// @ts-ignore
	// 	post: post,
	// 	is_like: true,
	// });

	// await like.save();

	res.status(201).json(post);
});

// /api/posts/:postId/unlike
export const unLikePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	// @ts-ignore
	const { postId } = req.params;

	const post = await getRepository(Post).findOne({ where: { id: +postId }, relations: ['likes', 'likes.user_id'] });

	console.log(post);
	// check post likes if they have a like user equal to current login user
	// const isLikeExist = post?.likes.find(like => like.user)

	// const like = await getRepository(Like).create({
	// 	// @ts-ignore
	// 	user: req.user,
	// 	// @ts-ignore
	// 	post: post,
	// 	is_like: false,
	// });

	res.status(201).json(post);
});
