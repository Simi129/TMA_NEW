import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const corsOptions: CorsOptions = {
    origin: ['https://walletbot.me', 'https://simi129.github.io', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  };

  app.enableCors(corsOptions);

  // Глобальный middleware для логирования запросов
  app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
  });

  await app.listen(3000);
}
bootstrap();