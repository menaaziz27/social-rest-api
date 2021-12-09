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
} from 'typeorm';

@Entity()
export class Like extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	// @Column()
	// user_id: TableForeignKey;

	// // @Column()
	// // post_id: TableForeignKey;

	// @Column()
	// text: string;
}
