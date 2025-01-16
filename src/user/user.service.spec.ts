import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;
  let configService: ConfigService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    email: 'ftopadmin@gmail.com',
    password: 'hashedPassword',
  };

  const mockUserRepository = {
    findOne: jest.fn(async (criteria) => {
      if (criteria.where?.email === mockUser.email) {
        return mockUser;
      }
      return null;
    }),
  };

  const mockConfigService = {
    get: jest.fn((key) => {
      if (key === 'JWT_SECRET') return 'testSecret';
      return null;
    }),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mockToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);

    jest.spyOn(bcrypt, 'compare').mockImplementation(async (password, hashedPassword) => {
      return password === 'correctPassword' && hashedPassword === 'hashedPassword';
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loginUser', () => {
    it('should log in with correct password', async () => {
      const loginDto = {
        emailOrPhone: 'ftopadmin@gmail.com',
        password: 'correctPassword',
      };

      const token = await service.loginUser(loginDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.emailOrPhone },
      });
      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token).toBe('mockToken');
    });

    it('should throw an error for incorrect password', async () => {
      const loginDto = {
        emailOrPhone: 'ftopadmin@gmail.com',
        password: 'wrongPassword',
      };

      await expect(service.loginUser(loginDto)).rejects.toThrow(HttpException);
      await expect(service.loginUser(loginDto)).rejects.toThrowError(
        new HttpException('Password is not correct', HttpStatus.BAD_REQUEST),
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.emailOrPhone },
      });
    });
  });
});
