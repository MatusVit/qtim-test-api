import { IPagination } from '../../schemas/IPagination';
import { Article } from './article.entity';

export class ArticlePagination implements IPagination<Article> {
  total: number;
  page: number;
  data: Article[];
}
