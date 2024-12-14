import { Comment } from './comment.model';

export interface PostWithComments {
  id: number;
  title: string;
  content: string;
  state: string;
  creationDate: Date;
  publicationDate: Date;
  author: string;
  authorId: number;
  comments: Comment[];
  category: string;
}
