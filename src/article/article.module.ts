import { Module } from '@nestjs/common';
import { ArticleController } from '@app/article/article.controller';
import { ArticleService } from '@app/article/article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '@app/article/article.entity';
import { UtilsProvider } from '@app/utils/utils.provider';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  controllers: [ArticleController],
  providers: [ArticleService, UtilsProvider],
})
export class ArticleModule {}
