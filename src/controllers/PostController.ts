import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Post } from '../entities/Post.entity';
import { User } from '../entities/User.entity';
import { asyncHandler } from '../middlewares/asyncHandler';
// import { PostService } from '../services/Post.service';

export const getPosts = asyncHandler(async (req: Request, res: Response, next: any) => {
	let posts = await getRepository(Post).find({ relations: ['user'], loadEagerRelations: true });
	res.json(posts);
});

export const createPost = asyncHandler(async (req: Request, res: Response, next: any) => {
	let users = await getRepository(User).find({});
	let user = users[1];
	// console.log({ user_id });
	const { title, content } = req.body;
	let post = await getRepository(Post).create({
		user,
		title,
		content,
	});

	await post.save();
	res.json(post);
});

export const editPost = asyncHandler(async (req: Request, res: Response, next: any) => {
	const { title, content } = req.body;
	const { id } = req.params;
	let post = await getRepository(Post).findOne({
		where: { id },
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

export const deletePost = asyncHandler(async (req: Request, res: Response, next: any) => {
	const { id } = req.params;
	let post = await getRepository(Post).delete(id);

	res.json(post);
});

// export class PostController {
// 	private postService = new PostService();

// 	async get(req: Request, res: Response, next: any): Promise<any> {
// 		const posts = await this.postService.findAll();

// 		return res.status(200).json(posts);
// 	}
// }

// export class PostController {
// 	private postService;
// 	constructor(service: PostService) {
// 		this.postService = service;
// 	}

// 	find() {
// 		return this.postService.findAll();
// 	}
// }
