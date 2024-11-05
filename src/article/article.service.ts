import { instanceToPlain } from 'class-transformer';
import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from '../schemas/IUser';
import { Repository } from 'typeorm';
import { ListArticleDto } from './dto/list-article.dto';
import { ArticlePagination } from './entities/article-pagination.entity';
import { MESSAGE } from '../common/constants/massages';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  create(dto: CreateArticleDto, user: IUser): Promise<Article> {
    const article = {
      ...dto,
      author: { userId: user.userId },
    };
    return this.articleRepository.save(article);
  }

  async findAll(page: number, limit: number, filter?: ListArticleDto): Promise<ArticlePagination> {
    const cacheKey = `articles_page_${page}_limit_${limit}_filter_${JSON.stringify(filter)}`;
    const cachedArticles = await this.cacheManager.get<ArticlePagination>(cacheKey);

    if (cachedArticles) {
      return cachedArticles;
    }
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .select([
        'article.articleId',
        'article.title',
        'article.content',
        'article.date',
        'article.createdAt',
        'article.updatedAt',
      ])
      .leftJoinAndSelect('article.author', 'author')
      .addSelect(['author.userId', 'author.name', 'author.password']);

    if (filter?.title) {
      queryBuilder.andWhere('article.title LIKE :title', { title: `%${filter.title}%` });
    }

    if (filter?.author) {
      queryBuilder.andWhere('author.name LIKE :authorName', {
        authorName: `%${filter.author}%`,
      });
    }

    if (filter?.publishDate) {
      const date = new Date(filter.publishDate.date);

      if (filter.publishDate.mode === 'after') {
        queryBuilder.andWhere(`article.date > :date`, { date });
      }

      if (filter.publishDate.mode === 'before') {
        queryBuilder.andWhere(`article.date < :date`, { date });
      }

      if (!filter.publishDate.mode) {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        queryBuilder.andWhere('article.date BETWEEN :startOfDay AND :endOfDay', {
          startOfDay,
          endOfDay,
        });
      }
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [articles, total] = await queryBuilder.getManyAndCount();

    const result = { data: articles, total, page };
    await this.cacheManager.set(cacheKey, instanceToPlain(result), 60000);
    return result;
  }

  async findOne(articleId: number): Promise<Article | null> {
    const cacheKey = `article_${articleId}`;
    const cachedArticle = await this.cacheManager.get<Article>(cacheKey);

    if (cachedArticle) {
      return cachedArticle;
    }

    const article = await this.articleRepository.findOne({
      where: { articleId },
      relations: ['author'],
    });

    if (article) {
      await this.cacheManager.set(cacheKey, instanceToPlain(article), 60000);
    }
    return article;
  }

  async update(articleId: number, updateArticleDto: UpdateArticleDto, user: IUser) {
    const article = await this.articleRepository.findOne({ where: { articleId } });
    if (!article) {
      throw new BadRequestException(MESSAGE.ENTITY_NOT_FOUND);
    }
    if (article.authorUserId !== user.userId) {
      throw new ForbiddenException(MESSAGE.NO_ACCESS);
    }
    const updatedArticle = {
      ...article,
      ...updateArticleDto,
    };
    await this.clearArticleCache(articleId);

    return this.articleRepository.save(updatedArticle);
  }

  async remove(articleId: number, user: IUser): Promise<void> {
    const article = await this.articleRepository.findOne({ where: { articleId } });
    if (!article) {
      throw new BadRequestException(MESSAGE.ENTITY_NOT_FOUND);
    }
    if (article.authorUserId !== user.userId) {
      throw new ForbiddenException(MESSAGE.NO_ACCESS);
    }
    await this.clearArticleCache(articleId);

    await this.articleRepository.delete({ articleId });
  }

  private async clearArticleCache(articleId: number) {
    await this.cacheManager.del(`article_${articleId}`);

    const keys = (await this.cacheManager.store.keys('articles_page_*')) as string[];
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
  }
}
