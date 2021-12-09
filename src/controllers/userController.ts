import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User.entity';
import { asyncHandler } from '../middlewares/asyncHandler';
// import { PostService } from '../services/Post.service';

export const getUsers = asyncHandler(async (req: Request, res: Response, next: any) => {
	let users = await getRepository(User).find({ relations: ['posts'], loadEagerRelations: true });
	res.json(users);
});
export const createUsers = asyncHandler(async (req: Request, res: Response, next: any) => {
	const { name, email, password } = req.body;
	console.log(req.body);
	let user = await getRepository(User).create({ name, email, password });

	await user.save();
	console.log(user);
	res.json(user);
});
