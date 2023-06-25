import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly body: string;
}
