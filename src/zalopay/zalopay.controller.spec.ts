import { Test, TestingModule } from '@nestjs/testing';
import { ZalopayController } from './zalopay.controller';

describe('ZalopayController', () => {
  let controller: ZalopayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZalopayController],
    }).compile();

    controller = module.get<ZalopayController>(ZalopayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
