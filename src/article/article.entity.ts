import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from './comment.entity';

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column()
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('simple-array')
  tagList: string[];

  @Column({ default: 0 })
  favoritesCount: number;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @OneToMany(() => CommentEntity, (comment) => comment.article)
  comments: CommentEntity[];

  @ManyToOne(() => UserEntity, (user) => user.articles)
  @JoinColumn({ name: 'author' })
  author: UserEntity;
}
