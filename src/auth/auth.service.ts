import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/auth.dto';
import { MESSAGE } from 'src/common/constants/massages';
import { compareData, getHash } from 'src/common/utils/hash.utils';
import { plainToInstance } from 'class-transformer';
import { SingUpDto } from './dto/singup.dto';
import { Tokens } from './entities/tokens.entity';
import { IJwtPayload } from 'src/schemas/IJwtPayload';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/schemas/IUser';

@Injectable()
export class AuthService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private usersService: UsersService,
    // eslint-disable-next-line no-unused-vars
    private jwtService: JwtService,
  ) {}

  async signup(dto: SingUpDto): Promise<IUser> {
    const newUser = await this.usersService.create(dto);
    return newUser;
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const user = await this.usersService.findOneByLogin(dto.login);
    if (!user) throw new ForbiddenException(MESSAGE.BAD_LOGIN_USER);

    const isCorrectPassword = await compareData(dto.password, user.password);
    if (!isCorrectPassword) throw new ForbiddenException(MESSAGE.BAD_PASSWORD);

    return await this.getTokens(user.userId, user.login);
  }

  async refresh(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new UnauthorizedException(MESSAGE.USER_NOT_EXIST);

    const isCorrectRefreshToken = await compareData(refreshToken, user.refreshToken);
    if (!isCorrectRefreshToken) throw new ForbiddenException(MESSAGE.BAD_REFRESH_TOKEN);

    return await this.getTokens(user.userId, user.login);
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    this.usersService.update({ userId, refreshToken });
  }

  private async createNewTokens(userId: number, login: string): Promise<Tokens> {
    const payload: IJwtPayload = { userId, login };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: `${process.env.JWT_SECRET_ACCESS_KEY}`,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: `${process.env.JWT_SECRET_REFRESH_KEY}`,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    ]);

    return plainToInstance(Tokens, { accessToken, refreshToken });
  }

  private async getTokens(userId: number, login: string): Promise<Tokens> {
    const tokens = await this.createNewTokens(userId, login);
    const hashRefreshToken = await getHash(tokens.refreshToken);
    await this.updateRefreshToken(userId, hashRefreshToken);
    return tokens;
  }
}
