export interface Post {
  id: number;
  title: string;
  content: string;
  state: string;
  creationDate: Date;
  publicationDate: Date;
  author: string;
  authorId: number;
  category: string;
}
