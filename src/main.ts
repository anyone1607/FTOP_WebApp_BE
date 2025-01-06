import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session'; 
import passport from 'passport'; 
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
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
  // Cấu hình thư mục tĩnh
  const path = require('path');
  // app.use('/uploads/products', express.static(path.join(__dirname, '../uploads/products')));
  // app.use('/uploads/products', express.static(path.join(__dirname, '..', 'uploads/products')));
  // console.log('Serving static assets from:', join(__dirname, '..', 'uploads/products'));
  app.use(
    '/uploads/products',  
    express.static(path.join(__dirname, '..', '..', 'uploads/products'))
  );
  app.use(
    '/uploads/store',
    express.static(path.join(__dirname, '..', '..', 'uploads/store'))
  );
  const port = configService.get<number>('PORT') || 9999;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  
}
bootstrap();
