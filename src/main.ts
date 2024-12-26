import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session'; 
import passport from 'passport'; 
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.setGlobalPrefix('api');

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET'),
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: parseInt(configService.get<string>('SESSION_MAX_AGE'), 10) || 120000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  const port = configService.get<number>('PORT') || 9999;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  
}
bootstrap();
