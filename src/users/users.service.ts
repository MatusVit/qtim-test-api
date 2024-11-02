import { ForbiddenException, Injectable } from '@nestjs/common';
import { MESSAGE } from 'src/common/constants/massages';
import { getHash } from 'src/common/utils/hash.utils';
import { IUser } from 'src/schemas/IUser';

@Injectable()
export class UsersService {
  private readonly users: IUser[] = [
    // ! *** заменить
    {
      userId: 1,
      name: 'john',
      login: 'john',
      password: '$2b$10$1UGNdSHkZRTmJxaR1cIOJeYk78zlSBCsqYaEYS2KC.wqoPZRsf0Pa',
      email: 'john@ma.com',
      createdAt: '2024-11-01 T07:04:27.880Z',
      updatedAt: '2024-11-01 T07:04:27.880Z',
      refreshToken: '12321321',
    },
    {
      userId: 2,
      name: 'maria',
      login: 'maria',
      password: '$2b$10$1UGNdSHkZRTmJxaR1cIOJeYk78zlSBCsqYaEYS2KC.wqoPZRsf0Pa',
      email: 'maria@ma.com',
      createdAt: '2024-11-01 T10:04:27.880Z',
      updatedAt: '2024-11-01 T10:04:27.880Z',
      refreshToken: '12321321',
    },
  ];

  async findOneByLogin(login: string): Promise<IUser | undefined> {
    return this.users.find((user) => user.login === login);
  }

  async findOneById(id: number): Promise<IUser | undefined> {
    return this.users.find((user) => user.userId === id);
  }

  async create(user: IUser): Promise<IUser> {
    const existUser = this.users.find((u) => u.login === user.login);
    if (existUser) throw new ForbiddenException(MESSAGE.NOT_UNIQUE_LOGIN);

    const hash = await getHash(user.password);
    const newUser: IUser = {
      ...user,
      userId: this.users.length + 1,
      password: hash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async update(user: IUser): Promise<IUser> {
    const existUser = this.users.find((u) => u.userId === user.userId);
    if (!existUser) throw new ForbiddenException(MESSAGE.USER_NOT_EXIST);

    const updatedUser: IUser = {
      ...existUser,
      ...user,
      updatedAt: new Date().toISOString(),
    };

    const index = this.users.findIndex((u) => u.userId === user.userId);
    this.users[index] = updatedUser;

    return updatedUser;
  }
}
