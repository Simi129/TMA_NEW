import { Controller, Get, Post, Headers, UnauthorizedException, Body } from '@nestjs/common';
import { UsersService } from './users.service';

const VALID_TOKEN = 'a9f00126a3c98d9c70f706573320baf949852fb6f9c777f079dfd74d08cbc87f'; // Замените на ваш реальный токен

@Controller('api/user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get('referrals')
  async getReferrals(@Headers('authorization') authHeader: string) {
    console.log('Получен запрос на /api/user/referrals');
    
    if (authHeader !== `Bearer ${VALID_TOKEN}`) {
      throw new UnauthorizedException('Invalid token');
    }

    const userId = 1; // Замените на реальный ID пользователя, если известен
    
    return this.usersService.getReferrals(userId);
  }

  @Post('initialize')
  async initializeUser(@Body() userData: {
    telegramId: string,
    username: string
  }) {
    console.log('Получен запрос на /api/user/initialize');
    return this.usersService.initializeUser(userData);
  }
}