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

export interface LikeDTO {
	user: User;
	post: Post;
}

@Entity()
export class Like extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: false })
	is_like: Boolean;

	@ManyToOne(() => User, user => user.likes, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne(() => Post, post => post.user, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'post_id' })
	post: Post;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
