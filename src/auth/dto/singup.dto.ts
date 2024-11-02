import { IUser } from 'src/schemas/IUser';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SingUpDto implements IUser {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
