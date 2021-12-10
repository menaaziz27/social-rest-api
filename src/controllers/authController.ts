import { Request, Response } from 'express';
import { User } from '../entities/User.entity';
import { asyncHandler } from '../middlewares/asyncHandler';
import generateToken from '../utils/generateToken';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password } = req.body;
	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('user already exists');
	}

	const user = await User.create({ name, email, password });
	await user.save();
	res.json({
		...user,
		token: await generateToken(user.id),
	});
});
