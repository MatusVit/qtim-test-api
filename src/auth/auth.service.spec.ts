import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/auth.dto';
import { SingUpDto } from './dto/singup.dto';
import { ForbiddenException } from '@nestjs/common';
import { getHash } from '../common/utils/hash.utils';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  const password = '55555';
  let hashedPassword: string;

  const mockUsersService = {
    create: jest.fn((dto: SingUpDto) => {
      return {
        userId: 1,
        login: dto.login,
        name: 'Test User',
        email: 'testuser@example.com',
        password: hashedPassword,
        refreshToken: 'hashed_refresh_token',
        createdAt: new Date(),
        updatedAt: new Date(),
        articles: [],
      };
    }),
    findOneByLogin: jest.fn((login: string) => {
      return {
        userId: 1,
        login: login,
        name: 'Test User',
        email: 'testuser@example.com',
        password: hashedPassword,
        refreshToken: 'hashed_refresh_token',
        createdAt: new Date(),
        updatedAt: new Date(),
        articles: [],
      };
    }),
    findOneById: jest.fn((userId: number) => {
      return {
        userId: userId,
        login: 'testuser',
        refreshToken: 'hashed_refresh_token',
      };
    }),
    update: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(() => {
      return 'token';
    }),
  };

  beforeEach(async () => {
    hashedPassword = await getHash(password);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('следует создать нового пользователя', async () => {
    const dto: SingUpDto = {
      name: 'Test User',
      login: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await authService.signup(dto);
    expect(result).toHaveProperty('userId');
    expect(result.login).toEqual(dto.login);
    expect(usersService.create).toHaveBeenCalledWith(dto);
  });

  it('возвращать токены в случае успешного входа', async () => {
    const dto: LoginDto = {
      login: 'testuser',
      password,
    };

    const result = await authService.login(dto);
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(usersService.findOneByLogin).toHaveBeenCalledWith(dto.login);
  });

  it('выдать ForbiddenException, если пользователь не существует', async () => {
    const dto: LoginDto = {
      login: 'non_existent_user',
      password: 'password123',
    };

    await expect(authService.login(dto)).rejects.toThrow(ForbiddenException);
  });

  it('выдать ForbiddenException, если токен обновления неверен', async () => {
    const userId = 1;
    const refreshToken = 'incorrect_token';

    await expect(authService.refresh(userId, refreshToken)).rejects.toThrow(ForbiddenException);
  });
});
