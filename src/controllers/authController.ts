import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User.entity';
import { asyncHandler } from '../middlewares/asyncHandler';
import generateTokens from '../utils/generateTokens';
import verifyToken from '../utils/verifyToken';
const bcrypt = require('bcryptjs');

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
	});
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body;
	// check for email and password if exists
	if (!email || !password) {
		res.status(400);
		throw new Error('Please provide your credentials.');
	}

	const user = await getRepository(User).findOne({ email });

	//if !exist
	if (!user) {
		res.status(401);
		throw new Error('User not found!');
	}

	// compare password
	const isMatched = await bcrypt.compare(password, user.password);
	if (!isMatched) {
		res.status(403);
		throw new Error('Password is incorrect');
	}
	// create the payload
	const payload = { id: user.id, email: user.email };
	// generate tokens with the payload
	const { accessToken, refreshToken } = generateTokens(payload);

	res.status(200).json({ message: 'success', accessToken, refreshToken });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
	// check the existing of refresh token
	const refreshTokenFromCookie = req.cookies['refresh-token'];
	if (!refreshTokenFromCookie || !verifyToken(refreshTokenFromCookie, true)) {
		return res.status(400).json({ success: false, message: 'Invalid refresh token' });
	}

	// @ts-ignore
	const payload = { id: req.user.id, email: req.user.email };

	const { accessToken, refreshToken } = generateTokens(payload);
	return res.json({ success: true, accessToken, refreshToken });
});
