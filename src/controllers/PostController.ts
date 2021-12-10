import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
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

	console.log({ skip });
	console.log({ take });

	let [posts, count] = await getRepository(Post).findAndCount({
		relations: ['user', 'comments'],
		take,
		skip,
	});

	res.json(posts);
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
