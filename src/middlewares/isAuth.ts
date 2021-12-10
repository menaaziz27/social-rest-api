import { NextFunction, Request, Response } from 'express';
const jwt = require('jsonwebtoken');

interface MiddlewareOptions {
	ignoreExpiredTokens: boolean;
}

const defaultOptions: MiddlewareOptions = {
	ignoreExpiredTokens: false,
};

export default function isAuth(options?: MiddlewareOptions) {
	const { ignoreExpiredTokens } = options ?? defaultOptions;
	return function (req: Request, res: Response, next: NextFunction) {
		const header = req.header('authorization');
		const token = header?.split('Bearer ')[1] ?? null;
		if (token === null) {
			res.status(401);
			throw new Error('Unauthorized');
		}
		jwt.verify(
			token,
			process.env.AUTH_TOKEN_SECRET as string,
			{ ignoreExpiration: ignoreExpiredTokens },
			(err: Error, user: object) => {
				if (err) {
					return res.status(401).json({ success: false, message: 'Token expired or invalid' });
				}
				//@ts-ignore
				req.user = user;
				return next();
			}
		);
	};
}
