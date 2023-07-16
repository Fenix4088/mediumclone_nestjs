import { CommentResponseInterface } from '@app/article/types/commentResponse.interface';

export type MultipleCommentsResponseType = {
  comments: CommentResponseInterface['comment'][];
};
