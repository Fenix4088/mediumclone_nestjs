import { Module } from '@nestjs/common';
import { ArticleController } from '@app/article/article.controller';
import { ArticleService } from '@app/article/article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '@app/article/article.entity';
import { UtilsProvider } from '@app/utils/utils.provider';
import { UserEntity } from '@app/user/user.entity';
import { FollowEntity } from '@app/profile/follow.entity';
import { CommentEntity } from '@app/article/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      UserEntity,
      FollowEntity,
      CommentEntity,
    ]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, UtilsProvider],
})
export class ArticleModule {}
