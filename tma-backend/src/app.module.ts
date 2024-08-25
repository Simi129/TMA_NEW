import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { User } from "./users/entities/user.entity";
import { proxyMiddlewareConfig } from './proxy.middleware';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: "db/main.sqlite3",
            synchronize: true,
            entities: [User],
        }),
        AuthModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        proxyMiddlewareConfig.consumer(consumer);
    }
}