import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/schemas/IUser';
import { Repository } from 'typeorm';
import { FindArticleDto } from './dto/find-article.dto';
import { ArticlePagination } from './entities/article-pagination.entity';
import { MESSAGE } from 'src/common/constants/massages';

@Injectable()
export class ArticleService {
  constructor(@InjectRepository(Article) private articleRepository: Repository<Article>) {}

  create(dto: CreateArticleDto, user: IUser): Promise<Article> {
    const article = {
      ...dto,
      author: { userId: user.userId },
    };
    return this.articleRepository.save(article);
  }

  async findAll(page: number, limit: number, filter?: FindArticleDto): Promise<ArticlePagination> {
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

    return { data: articles, total, page };
  }

  async findOne(articleId: number): Promise<Article | null> {
    return await this.articleRepository.findOne({
      where: { articleId },
      relations: ['author'],
    });
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

    this.articleRepository.delete({ articleId });
  }
}
