import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/schemas/IUser';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  // eslint-disable-next-line no-unused-vars
  constructor(@InjectRepository(Article) private articleRepository: Repository<Article>) {}

  create(dto: CreateArticleDto, user: IUser): Promise<Article> {
    const article = {
      ...dto,
      author: { userId: user.userId },
    };
    return this.articleRepository.save(article);
  }

  findAll(): Promise<Article[]> {
    // todo сделать пагинацию и фильтр
    return this.articleRepository.find({
      relations: ['author'],
    });
  }

  async findOne(articleId: number): Promise<Article | null> {
    return await this.articleRepository.findOne({
      where: { articleId },
      relations: ['author'],
    });
  }

  async update(articleId: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.articleRepository.findOne({ where: { articleId } });
    if (!article) {
      return null;
    }
    const updatedArticle = {
      ...article,
      ...updateArticleDto,
    };
    return this.articleRepository.save(updatedArticle);
  }

  async remove(articleId: number): Promise<void> {
    this.articleRepository.delete({ articleId });
  }
}
