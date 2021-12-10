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
	JoinColumn,
	ManyToOne,
} from 'typeorm';
import { Post } from './Post.entity';

@Entity()
export class Comment extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Post, post => post.comments)
	@JoinColumn({ name: 'post_id' })
	post: Post;

	@Column()
	text: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
