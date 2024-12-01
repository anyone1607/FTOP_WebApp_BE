import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    count: jest.fn().mockResolvedValue(10),
    findOneBy: jest.fn((criteria) =>
      Promise.resolve({
        id: criteria.id,
        email: 'test@example.com',
        displayName: 'Test User',
        avatar: 'avatar.png',
        role: 'user',
        password: 'hashedPassword',
        walletBalance: 100,
        isActive: true,
        order: [],
        bankTransfers: [],
      } as User),
    ),
    find: jest.fn().mockResolvedValue([
      {
        id: 1,
        email: 'test@example.com',
        displayName: 'Test User',
        avatar: 'avatar.png',
        role: 'user',
        password: 'hashedPassword',
        walletBalance: 100,
        isActive: true,
        order: [],
        bankTransfers: [],
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('countTotalUsers', () => {
    it('should return total user count', async () => {
      expect(await userService.countTotalUsers()).toBe(10);
      expect(userRepository.count).toHaveBeenCalled();
    });
  });

  describe('findUser', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      expect(await userService.findUser(userId)).toEqual({
        id: userId,
        email: 'test@example.com',
        displayName: 'Test User',
        avatar: 'avatar.png',
        role: 'user',
        password: 'hashedPassword',
        walletBalance: 100,
        isActive: true,
        order: [],
        bankTransfers: [],
      });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      expect(await userService.findAllUsers()).toEqual([
        {
          id: 1,
          email: 'test@example.com',
          displayName: 'Test User',
          avatar: 'avatar.png',
          role: 'user',
          password: 'hashedPassword',
          walletBalance: 100,
          isActive: true,
          order: [],
          bankTransfers: [],
        },
      ]);
      expect(userRepository.find).toHaveBeenCalled();
    });
  });
});
