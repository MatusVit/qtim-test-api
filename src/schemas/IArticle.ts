import { IUser } from './IUser';

export interface IArticle {
  id?: number;
  title?: string;
  content?: string;
  author?: IUser;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}
