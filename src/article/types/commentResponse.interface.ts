import { CommentEntity } from '@app/article/comment.entity';

export interface CommentResponseInterface {
  comment: Omit<CommentEntity, 'article' | 'updateTimestamp'>;
}
