import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as passport from 'passport';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.setGlobalPrefix('api');
  app.use(session({
    secret: 'laivanchung.1607@gmail.com',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000,
    }
  }))
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
  await app.listen(8000);
}
bootstrap();
