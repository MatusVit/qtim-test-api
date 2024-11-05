import { IsNotEmpty, IsString } from 'class-validator';
import { IArticle } from '../../schemas/IArticle';

export class CreateArticleDto implements IArticle {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
