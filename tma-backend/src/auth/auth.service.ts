import { Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) {}

    async login(initData: string): Promise<{ user: User; token: string }> {
        console.log('Received initData:', initData);

        let userData;
        try {
            const params = new URLSearchParams(initData);
            const userString = params.get('user');
            if (!userString) {
                console.warn('User data not found in initData, using default');
                userData = { id: '12345', username: 'default_user' };
            } else {
                userData = JSON.parse(decodeURIComponent(userString));
            }
        } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            userData = { id: '12345', username: 'default_user' };
        }

        console.log('Processed user data:', userData);

        try {
            const user = await this.usersService.findOrCreate(
                userData.id.toString(),
                userData.username || `user${userData.id}`
            );

            const payload = { sub: user.id };
            const token = await this.jwtService.signAsync(payload);

            return { user, token };
        } catch (e) {
            console.error('Error processing user:', e);
            throw new UnauthorizedException('Unable to process user data');
        }
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.usersService.findByTelegramId(id.toString());
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async validateToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}