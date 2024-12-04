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

  describe('Error Handling', () => {
    describe('getTotalUsers', () => {
      it('should return an error message if countTotalUsers fails', async () => {
        jest.spyOn(userService, 'countTotalUsers').mockRejectedValue(new Error('Failed to count users'));
  
        await expect(userController.getTotalUsers()).rejects.toThrow('Failed to count users');
        expect(userService.countTotalUsers).toHaveBeenCalled();
      });
    });
  
    
    describe('findUser', () => {
      it('should return an error message if user is not found', async () => {
        const userId = 2;
        // Mock the service to throw an exception
        jest.spyOn(userService, 'findUser').mockImplementation(() => {
          throw new Error(`User with ID ${userId} not found`);
        });
    
        // Expect the controller to handle the exception correctly
        await expect(userController.findUser(userId)).rejects.toThrow(
          `User with ID ${userId} not found`,
        );
        expect(userService.findUser).toHaveBeenCalledWith(userId);
      });
    
      it('should return an error message if findUser fails', async () => {
        const userId = 2;
        jest.spyOn(userService, 'findUser').mockRejectedValue(
          new Error('Database query failed'),
        );
    
        await expect(userController.findUser(userId)).rejects.toThrow(
          'Database query failed',
        );
        expect(userService.findUser).toHaveBeenCalledWith(userId);
      });
    });
    
    
    describe('findUsers', () => {
      it('should return an error message if findAllUsers fails', async () => {
        jest.spyOn(userService, 'findAllUsers').mockRejectedValue(new Error('Failed to retrieve users'));
  
        await expect(userController.findUsers()).rejects.toThrow('Failed to retrieve users');
        expect(userService.findAllUsers).toHaveBeenCalled();
      });
    });
  });
  
});