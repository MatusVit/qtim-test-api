import { IsDate, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { IArticle } from '../../schemas/IArticle';

export class UpdateArticleDto implements IArticle {
  @ValidateIf((o) => o.content === null)
  @IsString()
  @IsNotEmpty()
  title: string | null;

  @ValidateIf((o) => o.title === null)
  @IsString()
  @IsNotEmpty()
  content: string | null;

  @ValidateIf((o) => o.title === null)
  @IsDate()
  @IsNotEmpty()
  date: Date | null;
}
