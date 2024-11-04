import { IsDateString, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PublishDateFilterDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsIn(['before', 'after'])
  mode?: 'before' | 'after';
}

export class FindArticleDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PublishDateFilterDto)
  publishDate?: PublishDateFilterDto;
}
