import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User.entity';
import { asyncHandler } from '../middlewares/asyncHandler';

export const getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	let users = await getRepository(User).find({ relations: ['posts'], loadEagerRelations: true });
	res.json(users);
});
export const createUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { name, email, password } = req.body;
	console.log(req.body);
	let user = await getRepository(User).create({ name, email, password });

	await user.save();
	console.log(user);
	res.json(user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = req.params;
	// @ts-ignore
	if (req.user.id !== +userId) {
		res.status(400);
		throw new Error('Cannot perform this operation');
	}
	const deletedUser = await getRepository(User).softDelete({ id: +userId });
	res.status(200).json(deletedUser);
});

export const getDeletedUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = req.params;
	const deletedUser = await getRepository(User).restore(userId);
	res.status(200).json(deletedUser);
});
