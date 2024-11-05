import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ForbiddenException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('ArticleService', () => {
  let service: ArticleService;
  let articleRepository: Repository<Article>;

  const mockUser: User = {
    userId: 1,
    login: 'testuser',
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'hashed_password',
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    articles: [],
  };

  const mockArticle: Article = {
    articleId: 1,
    title: 'Test Article',
    content: 'Content',
    author: mockUser,
    authorUserId: mockUser.userId,
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const cacheManagerMock = {
    del: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    store: {
      keys: jest.fn().mockResolvedValue(['articles_page_1', 'articles_page_2']),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(Article),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    articleRepository = module.get<Repository<Article>>(getRepositoryToken(Article));
  });

  it('быть определен', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('создавать статью', async () => {
      const dto: CreateArticleDto = { title: 'New Article', content: 'Content' };
      const article = { ...mockArticle, ...dto, articleId: 1, authorUserId: mockUser.userId };

      jest.spyOn(articleRepository, 'save').mockResolvedValueOnce(article);

      const result = await service.create(dto, mockUser);
      expect(result).toEqual(article);
      expect(articleRepository.save).toHaveBeenCalledWith({
        ...dto,
        author: { userId: mockUser.userId },
      });
    });
  });

  describe('findOne', () => {
    it('возвращать статью', async () => {
      jest.spyOn(articleRepository, 'findOne').mockResolvedValueOnce(mockArticle);

      const result = await service.findOne(1);
      expect(result).toEqual(mockArticle);
    });
  });

  describe('update', () => {
    it('обновить статью', async () => {
      const updateDto: UpdateArticleDto = { title: 'Updated Title', content: null, date: null };
      const article = {
        ...mockArticle,
        articleId: 1,
        title: 'Old Title',
        content: 'Old Content',
        authorUserId: mockUser.userId,
      };

      jest.spyOn(articleRepository, 'findOne').mockResolvedValueOnce(article);
      jest.spyOn(articleRepository, 'save').mockResolvedValueOnce({ ...article, ...updateDto });

      const result = await service.update(1, updateDto, mockUser);
      expect(result).toEqual({ ...article, ...updateDto });
    });

    it('выдать ForbiddenException, если автор не совпадает', async () => {
      const article = { ...mockArticle, articleId: 1, authorUserId: 2 };

      jest.spyOn(articleRepository, 'findOne').mockResolvedValueOnce(article);

      await expect(
        service.update(1, { title: 'Updated Title', content: null, date: null }, mockUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('удалять статью', async () => {
      const article = { ...mockArticle, articleId: 1, authorUserId: mockUser.userId };

      jest.spyOn(articleRepository, 'findOne').mockResolvedValueOnce(article);
      jest.spyOn(articleRepository, 'delete').mockResolvedValueOnce(null);

      await service.remove(1, mockUser);
      expect(articleRepository.delete).toHaveBeenCalledWith({ articleId: 1 });
    });

    it('выдать ForbiddenException, если пользователь не является автором', async () => {
      const article = { ...mockArticle, articleId: 1, authorUserId: 2 };

      jest.spyOn(articleRepository, 'findOne').mockResolvedValueOnce(article);

      await expect(service.remove(1, mockUser)).rejects.toThrow(ForbiddenException);
    });
  });
});
