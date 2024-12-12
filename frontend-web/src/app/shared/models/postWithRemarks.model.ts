import { Remark } from './remark.model';

export interface PostWithRemarks {
  id: number;
  title: string;
  content: string;
  state: string;
  creationDate: Date;
  publicationDate: Date;
  author: string;
  authorId: number;
  remarks: Remark[];
}
