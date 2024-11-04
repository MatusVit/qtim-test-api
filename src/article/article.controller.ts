import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/schemas/IUser';
import { Article } from './entities/article.entity';
import { FindArticleDto } from './dto/find-article.dto';
import { ArticlePagination } from './entities/article-pagination.entity';
import { PaginationQueryDto } from './dto/pagination.dto';

@Controller('article')
@UseInterceptors(ClassSerializerInterceptor)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@ReqUser() user: IUser, @Body() dto: CreateArticleDto): Promise<Article> {
    return this.articleService.create(dto, user);
  }

  @Public()
  @Post('find')
  findAll(
    @Query() query: PaginationQueryDto,
    @Body() filter: FindArticleDto,
  ): Promise<ArticlePagination> {
    const { page = 1, limit = 10 } = query;
    return this.articleService.findAll(page, limit, filter);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Article> {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @ReqUser() user: IUser,
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articleService.update(+id, updateArticleDto, user);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@ReqUser() user: IUser, @Param('id') id: string): Promise<void> {
    return this.articleService.remove(+id, user);
  }
}
