import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User.entity';
import { asyncHandler } from '../middlewares/asyncHandler';
import generateTokens from '../utils/generateTokens';
import verifyToken from '../utils/verifyToken';
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password } = req.body;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400);
		throw new Error(`${errors.array()[0].param}: ${errors.array()[0].msg}`);
	}

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

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400);
		throw new Error(`${errors.array()[0].param}: ${errors.array()[0].msg}`);
	}

	const user = await getRepository(User).findOne({ email });

	if (!user) {
		res.status(401);
		throw new Error('User not found!');
	}

	const isMatched = await bcrypt.compare(password, user.password);
	if (!isMatched) {
		res.status(403);
		throw new Error('Password is incorrect');
	}
	const payload = { id: user.id, email: user.email };
	const { accessToken, refreshToken } = generateTokens(payload);

	res.status(200).json({ message: 'success', accessToken, refreshToken });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
	const refreshTokenFromCookie = req.cookies['refresh-token'];
	if (!refreshTokenFromCookie || !verifyToken(refreshTokenFromCookie, true)) {
		return res.status(400).json({ success: false, message: 'Invalid refresh token' });
	}

	// @ts-ignore
	const payload = { id: req.user.id, email: req.user.email };

	const { accessToken, refreshToken } = generateTokens(payload);
	return res.json({ success: true, accessToken, refreshToken });
});
