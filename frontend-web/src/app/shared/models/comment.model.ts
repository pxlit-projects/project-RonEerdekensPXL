export interface Comment {
  id: number;
  postId: number;
  comment: string;
  creationDate: Date;
  authorId: number;
  author: string;
}
