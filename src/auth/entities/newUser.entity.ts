import { Exclude } from 'class-transformer';
import { IUser } from 'src/schemas/IUser';

export class UserEntity implements IUser {
  userId: number;

  login: string;

  @Exclude()
  password: string;

  @Exclude()
  refreshToken: string;

  createdAt: string;

  updatedAt: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
