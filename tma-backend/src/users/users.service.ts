import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByTelegramId(telegramId: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { telegramId } });
  }

  async createUser(telegramId: string, username: string): Promise<User> {
    const user = this.usersRepository.create({
      telegramId,
      username,
    });
    return this.usersRepository.save(user);
  }

  async findOrCreate(telegramId: string, username: string): Promise<User> {
    let user = await this.findByTelegramId(telegramId);

    if (!user) {
      user = await this.createUser(telegramId, username);
    } else if (user.username !== username) {
      // Обновляем username, если он изменился
      user.username = username;
      await this.usersRepository.save(user);
    }

    return user;
  }

  // Добавляем новый метод для получения рефералов
  async getReferrals(userId: number): Promise<User[]> {
    // Предполагаем, что у вас есть поле referrerId в сущности User
    // Если нет, вам нужно будет модифицировать сущность User и схему базы данных
    return this.usersRepository.find({
      where: { referrerId: userId },
    });
  }
}