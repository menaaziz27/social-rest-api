import express from 'express';
import * as dotenv from 'dotenv';
import { connectToDb } from './db/database';
import { errorHandler, notFound } from './middlewares/errorMiddlewares';

dotenv.config();

const postRoutes = require('./routes/post.ts');
const commentRoutes = require('./routes/comment');
const userRoutes = require('./routes/user');

connectToDb().then(client => {
	console.log(`connected to db ${client.options.database}`);

	const app = express();

	app.use(express.json());
	app.use(postRoutes);
	app.use(userRoutes);
	app.use(commentRoutes);
	app.use(notFound);
	app.use(errorHandler);

	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => {
		console.log('server running on ' + PORT);
	});
});
