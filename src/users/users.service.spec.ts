import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';
import { MESSAGE } from '../common/constants/massages';

jest.mock('../common/utils/hash.utils', () => ({
  getHash: jest
    .fn()
    .mockResolvedValue('$2b$10$iZlfzHU67qcOD3br.nvRxeziEMj4AGy3w2ButTcxKjeetFu6CZTFW'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('должно быть определено', () => {
    expect(service).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('findOneByLogin', () => {
    it('вернуть пользователя по логину', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(mockUser);
      const result = await service.findOneByLogin('testuser');
      expect(result).toEqual(mockUser);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ login: 'testuser' });
    });

    it('возвращать null, если пользователь не найден', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(null);
      const result = await service.findOneByLogin('unknown');
      expect(result).toBeNull();
    });
  });

  describe('findOneById', () => {
    it('возвращать пользователя по ID', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(mockUser);
      const result = await service.findOneById(1);
      expect(result).toEqual(mockUser);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ userId: 1 });
    });

    it('возвращать null, если пользователь не найден', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(null);
      const result = await service.findOneById(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('создать нового пользователя, если логин уникален', async () => {
      const newUser: User = {
        userId: 2,
        login: 'newUser',
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        articles: [],
      };

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(usersRepository, 'save').mockResolvedValueOnce({
        ...newUser,
        password: '$2b$10$iZlfzHU67qcOD3br.nvRxeziEMj4AGy3w2ButTcxKjeetFu6CZTFW',
      });

      const result = await service.create(newUser);
      expect(usersRepository.save).toHaveBeenCalledWith({
        ...newUser,
        password: '$2b$10$iZlfzHU67qcOD3br.nvRxeziEMj4AGy3w2ButTcxKjeetFu6CZTFW',
      });
      expect(result).toEqual({
        ...newUser,
        password: '$2b$10$iZlfzHU67qcOD3br.nvRxeziEMj4AGy3w2ButTcxKjeetFu6CZTFW',
      });
    });

    it('выдавать ошибку, если логин не уникален', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(mockUser);

      await expect(service.create(mockUser)).rejects.toThrow(
        new ForbiddenException(MESSAGE.NOT_UNIQUE_LOGIN),
      );
    });
  });

  describe('update', () => {
    it('обновить существующего пользователя', async () => {
      const updatedUser: User = {
        ...mockUser,
        name: 'Updated Name',
      };

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(mockUser);
      jest.spyOn(usersRepository, 'save').mockResolvedValueOnce(updatedUser);

      const result = await service.update(updatedUser);
      expect(result).toEqual(updatedUser);
      expect(usersRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('выдать ошибку, если пользователь не существует', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(service.update(mockUser)).rejects.toThrow(
        new ForbiddenException(MESSAGE.USER_NOT_EXIST),
      );
    });
  });
});
