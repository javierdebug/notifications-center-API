import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';

interface AuthInput {
  email: string;
  password: string;
}
type SignInData = { id: number; username: string };
type AuthResult = { accessToken: string; id: number; username: string };

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: SignInDto): Promise<AuthResult> {
    const user = await this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user);
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService.findUserByEmail(input.email);

    if (user && user.password === input.password) {
      return {
        id: user.id,
        username: user.username,
      };
    }

    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload = { sub: user.id, username: user.username };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      accessToken,
      id: user.id,
      username: user.username,
    };
  }

  async signUp(input: SignUpDto): Promise<AuthResult> {
    const newUser = await this.usersService.createUser(input);
    return this.signIn(newUser);
  }
}
