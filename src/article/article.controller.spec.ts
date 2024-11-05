import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';

describe('ArticleController', () => {
  let controller: ArticleController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

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
    title: 'Test',
    content: 'Content',
    author: mockUser,
    authorUserId: mockUser.userId,
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [{ provide: ArticleService, useValue: mockService }],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
    // service = module.get<ArticleService>(ArticleService);
  });

  it('быть определен', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('вызывать service.create', async () => {
      const dto: CreateArticleDto = { title: 'Test Article', content: 'Content' };
      const article = { articleId: 1, ...dto, authorUserId: mockUser.userId };

      mockService.create.mockResolvedValue(article);

      const result = await controller.create(mockUser, dto);
      expect(result).toEqual(article);
      expect(mockService.create).toHaveBeenCalledWith(dto, mockUser);
    });
  });

  describe('findOne', () => {
    it('возвращать статью', async () => {
      mockService.findOne.mockResolvedValue(mockArticle);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockArticle);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('вызывать service.update', async () => {
      const updateDto: UpdateArticleDto = { title: 'Updated Title', content: null, date: null };
      const article = { articleId: 1, title: 'Updated Title', authorUserId: mockUser.userId };

      mockService.update.mockResolvedValue(article);

      const result = await controller.update(mockUser, '1', updateDto);
      expect(result).toEqual(article);
      expect(mockService.update).toHaveBeenCalledWith(1, updateDto, mockUser);
    });
  });

  describe('remove', () => {
    it('вызывать service.remove', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove(mockUser, '1');
      expect(mockService.remove).toHaveBeenCalledWith(1, mockUser);
    });
  });
});
