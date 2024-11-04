import { IPagination } from 'src/schemas/IPagination';
import { Article } from './article.entity';

export class ArticlePagination implements IPagination<Article> {
  total: number;
  page: number;
  data: Article[];
}
