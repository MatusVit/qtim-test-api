import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MESSAGE } from 'src/common/constants/massages';
import { getHash } from 'src/common/utils/hash.utils';
import { IUser } from 'src/schemas/IUser';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  // eslint-disable-next-line no-unused-vars
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async findOneByLogin(login: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ login });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ userId: id });
  }

  async create(user: IUser): Promise<IUser> {
    const existUser = await this.usersRepository.findOneBy({ login: user.login });
    if (existUser) throw new ForbiddenException(MESSAGE.NOT_UNIQUE_LOGIN);

    const hash = await getHash(user.password);
    const newUser: IUser = {
      ...user,
      password: hash,
    };

    return this.usersRepository.save(newUser);
  }

  async update(user: IUser): Promise<IUser> {
    const existUser = this.usersRepository.findOneBy({ userId: user.userId });
    if (!existUser) throw new ForbiddenException(MESSAGE.USER_NOT_EXIST);

    const updatedUser: IUser = {
      ...existUser,
      ...user,
    };

    await this.usersRepository.save(updatedUser);
    return updatedUser;
  }
}
