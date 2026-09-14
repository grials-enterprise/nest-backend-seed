import * as assert from 'assert';
import { Test } from '@nestjs/testing';
import { AppController } from '../../src/app.controller.js';
import { AppService } from '../../src/app.service.js';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = moduleRef.get(AppController);
  });

  it('getHello returns "Hello World!"', () => {
    assert.strictEqual(controller.getHello(), 'Hello World!');
  });
});

describe('AppService', () => {
  it('getHello returns "Hello World!"', () => {
    const service = new AppService();
    assert.strictEqual(service.getHello(), 'Hello World!');
  });
});
