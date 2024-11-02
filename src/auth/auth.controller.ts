import { plainToInstance } from 'class-transformer';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { Tokens } from './entities/tokens.entity';
import { MESSAGE } from './../common/constants/massages';
import { AuthService } from './auth.service';
import { SingUpDto } from './dto/singup.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { Request } from 'express';
import { IUser } from 'src/schemas/IUser';
import { UserEntity } from './entities/newUser.entity';

@Controller('auth')
export class AuthController {
  // eslint-disable-next-line no-unused-vars
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SingUpDto): Promise<IUser> {
    const user = await this.authService.signup(dto);
    return plainToInstance(UserEntity, user);
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<Tokens> {
    return await this.authService.login(dto);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request): Promise<Tokens> {
    const { body, user } = req;

    if (Date.now() >= user['exp'] * 1000)
      throw new UnauthorizedException(MESSAGE.EXPIRED_REFRESH_TOKEN);

    return await this.authService.refresh(user.userId, body.refreshToken);
  }
}
