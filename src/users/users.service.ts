import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from 'src/auth/dto/signUp.dto';
import { Repository } from 'typeorm';
import { UserEntity as User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findUserByName(username: string): Promise<User | null> {
    const existingUser = await this.usersRepository.findOneBy({
      username: username,
    });

    return existingUser;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const existingUser = await this.usersRepository.findOneBy({ email });
    return existingUser;
  }

  async createUser(user: SignUpDto): Promise<User> {
    const existingUser = await this.findUserByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const newUser: User = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async updateUser(id: number, user: SignUpDto): Promise<User> {
    const existingUser = await this.findUserById(id);
    if (!existingUser) {
      throw new NotFoundException('User not registered');
    }

    const updatedUser: User = {
      id: existingUser.id,
      email: user.email,
      username: user.username,
      password: user.password,
    };
    await this.deleteUser(id);
    const newUser: User = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    const existingUser = await this.findUserById(id);
    if (!existingUser) {
      throw new NotFoundException('User not registered');
    }

    await this.usersRepository.delete(id);
  }
}
