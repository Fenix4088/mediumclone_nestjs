import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: new Date() })
  createdAt: Date;

  @Column({ type: 'timestamp', default: new Date() })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => ArticleEntity, (article) => article.comments)
  @JoinColumn({ name: 'article_id' })
  article: ArticleEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'author' })
  author: UserEntity;

  @Column()
  body: string;
}
