import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { join } from 'path';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require('path');

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
