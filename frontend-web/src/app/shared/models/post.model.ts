export interface Post {
  id: number;
  title: string;
  content: string;
  state: string;
  creationDate: Date | null;
  publicationDate: Date | null;
  author: string;
  authorId: number;
  category: string;
}
