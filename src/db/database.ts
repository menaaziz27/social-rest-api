import { createConnection } from 'typeorm';
import { Like } from '../entities/Like.entity';
import { Post } from '../entities/Post.entity';
import { User } from '../entities/User.entity';

export const connectToDb = async () => {
	try {
		return await createConnection({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password: 'admin',
			database: 'myproject',
			entities: [User, Post, Like],
			synchronize: true,
		});
	} catch (e) {
		console.error(e);
		throw new Error('Unable to connect to db.');
	}
};
