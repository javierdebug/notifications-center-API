import { Injectable } from '@nestjs/common';

export interface User {
  userId: number;
  username: string;
  email: string;
  password: string;
}

const usersMock: User[] = [
  {
    userId: 1,
    username: 'Javier',
    email: 'javier@javierd.com',
    password: 'password',
  },
  {
    userId: 2,
    username: 'Milena',
    email: 'milena@javierd.com',
    password: 'passwordMilena',
  },
];

@Injectable()
export class UsersService {
  async findUserByName(username: string): Promise<User | undefined> {
    return await usersMock.find((user) => user.username === username);
  }
}
