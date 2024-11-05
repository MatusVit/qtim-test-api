import { IUser } from '../../schemas/IUser';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto implements IUser {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
