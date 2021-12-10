const jwt = require('jsonwebtoken');

export default function generateTokens(user: object, expiresIn: string = '7d') {
	return {
		accessToken: jwt.sign(user, process.env.AUTH_TOKEN_SECRET as string, { expiresIn }),
		refreshToken: jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '14d' }),
	};
}
