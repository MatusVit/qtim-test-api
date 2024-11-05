import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { SingUpDto } from './dto/singup.dto';
import { Tokens } from './entities/tokens.entity';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signup: jest.fn((dto: SingUpDto) => {
      return {
        userId: 1,
        login: dto.login,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),
    login: jest.fn(() => {
      return new Tokens({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
    }),
    refresh: jest.fn(() => {
      return new Tokens({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('token') },
        },
      ],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('создать нового пользователя', async () => {
    const dto: SingUpDto = {
      name: 'Test User',
      login: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await authController.signup(dto);
    expect(result).toHaveProperty('userId');
    expect(result.login).toEqual(dto.login);
    expect(authService.signup).toHaveBeenCalledWith(dto);
  });

  it('возвращать токены в случае успешной авторизации', async () => {
    const dto: LoginDto = {
      login: 'testuser',
      password: 'password123',
    };

    const result = await authController.login(dto);
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(authService.login).toHaveBeenCalledWith(dto);
  });

  it('должны возвращать новые токены, если обновление прошло успешно', async () => {
    const user = { userId: 1, login: 'testuser' };
    const dto = { refreshToken: 'refreshToken' };

    const result = await authController.refresh(user, dto);
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(authService.refresh).toHaveBeenCalledWith(user.userId, dto.refreshToken);
  });
});
