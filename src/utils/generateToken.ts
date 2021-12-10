const jwt = require('jsonwebtoken');
import * as dotenv from 'dotenv';
dotenv.config();
const generateToken = async (id: number) => {
	return await jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export default generateToken;
