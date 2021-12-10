import { Request, Response } from 'express';
import express from 'express';
import { User } from '../entities/User.entity.js';
import { asyncHandler } from './asyncHandler.js';
const jwt = require('jsonwebtoken');

interface IUserRequest extends express.Request {
	user: any;
}

export const protect = asyncHandler(async (req: IUserRequest, res: Response, next: any) => {
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = await jwt.verify(token, process.env.JWT_SECRET);

			let user = await User.findByIds(decoded.id);
			req.user = user;

			next();
		} catch (e) {
			res.status(401);
			throw new Error('Not authorized, invald token');
		}
	} else {
		res.status(401);
		throw new Error('Not authorized');
	}
});
