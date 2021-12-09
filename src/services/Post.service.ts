import { getRepository, Repository } from 'typeorm';
import { Post } from '../entities/Post.entity';
// import { User } from '../entities/User.entity'

export class PostService {
	async findAll(): Promise<any> {
		return await getRepository(Post).find({});
	}
	// create(): any {
	//   return this.postRepository.create()
	// }
}
