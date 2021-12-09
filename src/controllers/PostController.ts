import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Post } from '../entities/Post.entity';
import { asyncHandler } from '../middlewares/asyncHandler';
// import { PostService } from '../services/Post.service';

export const getPosts = asyncHandler(async (req: Request, res: Response, next: any) => {
	let posts = await getRepository(Post).find({});
	res.json(posts);
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
