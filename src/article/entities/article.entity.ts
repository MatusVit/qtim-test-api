import { IUser } from 'src/schemas/IUser';
import { IArticle } from 'src/schemas/IArticle';
import { Exclude } from 'class-transformer';

class Author implements IUser {
  id: number;
  name: string;

  @Exclude()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;

  constructor(partial: Partial<Author>) {
    Object.assign(this, partial);
  }
}

export class Article implements IArticle {
  id: number;
  title: string;
  content: string;
  author: Author;
  date: string;
  createdAt: string;
  updatedAt: string;
}
