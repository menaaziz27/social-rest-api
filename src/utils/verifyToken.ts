const jwt = require('jsonwebtoken');

export default function verifyToken(token: string, refreshToken: boolean = false) {
	const { REFRESH_TOKEN_SECRET, AUTH_TOKEN_SECRET } = process.env;
	let isValid = false;
	jwt.verify(token, (refreshToken ? REFRESH_TOKEN_SECRET : AUTH_TOKEN_SECRET) as string, (err: Error, _user: any) => {
		if (err) {
			return (isValid = false);
		}
		return (isValid = true);
	});
	return isValid;
}
