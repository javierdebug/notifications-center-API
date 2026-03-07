import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() input: SignInDto) {
    return this.authService.authenticate(input);
  }

  @Post('signup')
  async sigin(@Body() input: SignUpDto) {
    return this.authService.signUp(input);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getUserInfo(@Request() req) {
    return req.user;
  }
}
