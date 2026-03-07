import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SignUpDto } from 'src/auth/dto/signUp.dto';

export interface User {
  userId: string;
  username: string;
  email: string;
  password: string;
}

//TODO: mock data, remove later
const usersMock: User[] = [
  {
    userId: randomUUID(),
    username: 'Javier',
    email: 'javier@javierd.com',
    password: 'password',
  },
  {
    userId: randomUUID(),
    username: 'Milena',
    email: 'milena@javierd.com',
    password: 'passwordMilena',
  },
];

@Injectable()
export class UsersService {
  async findAllUsers(): Promise<User[] | undefined> {
    return usersMock;
  }

  async findUserById(id: string): Promise<User | undefined> {
    const existingUser = await usersMock.find((user) => user.userId === id);
    return existingUser;
  }

  async findUserByName(username: string): Promise<User | undefined> {
    const existingUser = await usersMock.find(
      (user) => user.username === username,
    );
    return existingUser;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const existingUser = await usersMock.find((user) => user.email === email);
    return existingUser;
  }

  async createUser(user: SignUpDto): Promise<User> {
    const existingUser = await this.findUserByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const newUser: User = {
      userId: randomUUID(),
      ...user,
    };
    usersMock.push(newUser);
    return newUser;
  }

  async updateUser(id: string, user: SignUpDto): Promise<User> {
    const existingUser = await this.findUserById(id);
    if (!existingUser) {
      throw new NotFoundException('User not registered');
    }

    const updatedUser: User = {
      userId: existingUser.userId,
      email: user.email,
      username: user.username,
      password: user.password,
    };
    await this.deleteUser(id);
    usersMock.push(updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const existingUser = await this.findUserById(id);
    if (!existingUser) {
      throw new NotFoundException('User not registered');
    }

    const newUsersMock = usersMock.filter((user) => user.userId !== id);
    usersMock.length = 0;
    usersMock.push(...newUsersMock);
  }
}
