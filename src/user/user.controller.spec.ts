import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    countTotalUsers: jest.fn().mockResolvedValue(10),
    findUser: jest.fn((id: number) =>
      Promise.resolve({
        id,
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
    findAllUsers: jest.fn().mockResolvedValue([
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
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getTotalUsers', () => {
    it('should return total users count', async () => {
      expect(await userController.getTotalUsers()).toEqual({ totalUsers: 10 });
      expect(userService.countTotalUsers).toHaveBeenCalled();
    });
  });

  describe('findUser', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      expect(await userController.findUser(userId)).toEqual({
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
      expect(userService.findUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('findUsers', () => {
    it('should return all users', async () => {
      expect(await userController.findUsers()).toEqual([
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
      expect(userService.findAllUsers).toHaveBeenCalled();
    });
  });
});