import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '@app/article/article.entity';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import slugify from 'slugify';
import { UtilsProvider } from '@app/utils/utils.provider';
import { UpdateArticleDto } from '@app/article/dto/updateArticle.dto';
import { ArticlesResponseInterface } from '@app/article/types/articlesResponse.interface';
import { FollowEntity } from '@app/profile/follow.entity';
import { CreateCommentDto } from '@app/article/dto/createComment.dto';
import { CommentEntity } from '@app/article/comment.entity';
import { CommentResponseInterface } from '@app/article/types/commentResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
    private readonly utilsProvider: UtilsProvider,
  ) {}

  async getAllArticles(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = await this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createDate', 'DESC');

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.favorited,
        },
        relations: ['favorites'],
      });

      const ids = author.favorites.map((el) => el.id);
      //! если ids будет пустой, то queryBuilder сломаеться и вернет 500
      //! для этого приходиться прописывать КОСТЫЛЬ
      if (!!ids.length) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
      } else {
        //!КОСТЫЛЬ что бы прервать билдер
        queryBuilder.andWhere('0=1');
      }
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.author,
        },
      });

      if (!author) {
        throw new HttpException(
          `Author ${query.author} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      author &&
        queryBuilder.andWhere('articles.author = :id', { id: author.id });
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoriteIds: number[] = [];

    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        where: {
          id: currentUserId,
        },
        relations: ['favorites'],
      });

      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }

    const articlesCount = await queryBuilder.getCount();

    const articles = await queryBuilder.getMany();
    const articlesWithFavorites = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited };
    });

    return { articles: articlesWithFavorites, articlesCount };
  }

  async getFeed(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const follows = await this.followRepository.find({
      where: {
        followerId: currentUserId,
      },
    });

    if (!follows.length) return { articles: [], articlesCount: 0 };

    const followingUserIds = follows.map((follow) => follow.followingId);

    const queryBuilder = await this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.author IN (:...ids)', { ids: followingUserIds });

    queryBuilder.orderBy('articles.createDate', 'DESC');

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articlesCount = await queryBuilder.getCount();
    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = this.getSlug(createArticleDto.title);

    //! typeorm поймет что  article.author и user имеюют связь, по этому в поле author попадет только айдишник
    article.author = currentUser;

    return await this.articleRepository.save(article);
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    //! Instead, query builder we added { eager: true } option in article.entity level
    /*    return this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.slug = :slug', { slug })
      .getOne();*/

    return this.articleRepository.findOne({ where: { slug } });
  }

  async deleteArticle(
    currentUserId: number,
    slug: string,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    return this.articleRepository.delete({ slug });
  }

  async updateArticle(
    slug: string,
    currentUserId: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.save({
      ...article,
      ...updateArticleDto,
    });
  }

  async addArticleToFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId,
      },
      relations: ['favorites'],
    });

    const isNotFavorite =
      user.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) === -1;

    if (isNotFavorite) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }

  async removeArticleFromFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId,
      },
      relations: ['favorites'],
    });

    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async createComment(
    slug: string,
    createCommentDto: CreateCommentDto,
    currentUser: UserEntity,
  ): Promise<CommentEntity> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    const comment = new CommentEntity();
    comment.author = currentUser;
    comment.article = article;
    Object.assign(comment, createCommentDto);

    return await this.commentsRepository.save(comment);
  }

  buildCommentResponse(comment: CommentEntity): CommentResponseInterface {
    return { comment };
  }
  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      this.utilsProvider.generateRandomString()
    );
  }
}
