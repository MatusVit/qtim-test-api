import { IUser } from './IUser';

export interface IArticle {
  id?: number;
  title?: string;
  content?: string;
  author?: IUser;
  date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
