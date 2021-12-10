import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BeforeRemove,
	BeforeInsert,
	BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
	TableForeignKey,
	ManyToOne,
	JoinColumn,
	OneToOne,
} from 'typeorm';
import { Post } from './Post.entity';
import { User } from './User.entity';

@Entity()
export class Like extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, user => user.posts)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne(() => Post, post => post.user)
	@JoinColumn({ name: 'post_id' })
	post: Post;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
