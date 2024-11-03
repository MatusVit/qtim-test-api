import { plainToInstance } from 'class-transformer';
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
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/schemas/IUser';
import { Article } from './entities/article.entity';

@Controller('article')
@UseInterceptors(ClassSerializerInterceptor)
export class ArticleController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@ReqUser() user: IUser, @Body() dto: CreateArticleDto): Promise<Article> {
    return this.articleService.create(dto, user);
  }

  @Public()
  @Get()
  findAll(): Promise<Article[]> {
    // todo сделать пагинацию и фильтр
    return this.articleService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Article> {
    return this.articleService.findOne(+id);
    // return plainToInstance(Article, article);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto): Promise<Article> {
    return this.articleService.update(+id, updateArticleDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.articleService.remove(+id);
  }
}
