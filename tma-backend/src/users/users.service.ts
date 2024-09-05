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
      is_premium: false,
      coins: 0,
      level: 1,
      // created_at и last_login будут установлены автоматически
    });
    return this.usersRepository.save(user);
  }

  async findOrCreate(telegramId: string, username: string): Promise<User> {
    let user = await this.findByTelegramId(telegramId);

    if (!user) {
      user = await this.createUser(telegramId, username);
    } else {
      // Обновляем username и last_login, если пользователь уже существует
      user.username = username;
      user.last_login = new Date();
      await this.usersRepository.save(user);
    }

    return user;
  }

   async initializeUser(userData: {
    telegramId: string,
    username: string
  }): Promise<User> {
    const { telegramId, username } = userData;
    let user = await this.findByTelegramId(telegramId);

    if (!user) {
      user = await this.createUser(telegramId, username);
    } else {
      user.username = username;
      user.last_login = new Date();
      await this.usersRepository.save(user);
    }

    return user;
  }

  async getReferrals(userId: number): Promise<User[]> {
    return this.usersRepository.find({
      where: { referrer_id: userId },
    });
  }

  async updateUserCoins(userId: number, coins: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.coins += coins;
    return this.usersRepository.save(user);
  }

  async updateUserLevel(userId: number, level: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.level = level;
    return this.usersRepository.save(user);
  }

  async setUserPremium(userId: number, isPremium: boolean): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.is_premium = isPremium;
    return this.usersRepository.save(user);
  }

  async setUserReferrer(userId: number, referrerId: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.referrer_id) {
      throw new Error('User already has a referrer');
    }
    user.referrer_id = referrerId;
    return this.usersRepository.save(user);
  }
}