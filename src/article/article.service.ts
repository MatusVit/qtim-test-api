import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { IArticle } from 'src/schemas/IArticle';

@Injectable()
export class ArticleService {
  private db = new Map<number, IArticle>();

  create(createArticleDto: CreateArticleDto) {
    const id = this.db.size + 1;
    const nowDate: string = new Date().toISOString();
    const article = {
      ...createArticleDto,
      id,
      author: {
        id: 1,
        name: 'John Doe',
      },
      date: nowDate,
      createdAt: nowDate,
      updatedAt: nowDate,
    };
    this.db.set(id, article);

    return article;
  }

  findAll() {
    return Array.from(this.db.values());
  }

  findOne(id: number) {
    return this.db.get(id);
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = this.db.get(id);
    if (!article) {
      return null;
    }
    const updatedArticle = {
      ...article,
      ...updateArticleDto,
      updatedAt: new Date().toISOString(),
    };
    this.db.set(id, updatedArticle);
    return updatedArticle;
  }

  remove(id: number) {
    this.db.delete(id);
  }
}
