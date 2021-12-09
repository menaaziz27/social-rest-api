import { Repository, EntityRepository } from 'typeorm';
import { Post } from '../entities/Post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
	findById(): any {
		// return this.
	}
}
