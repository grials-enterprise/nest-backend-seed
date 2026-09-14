import * as assert from 'assert';
import { HeaderMiddleware } from '../../src/common/middlewares/header.middleware.js';

describe('HeaderMiddleware', () => {
  const middleware = new HeaderMiddleware();

  it('validates headers, builds logData and calls next', () => {
    const req: any = {
      path: '/defaults',
      method: 'GET',
      originalUrl: '/defaults?skip=1',
      headers: {
        'l-api-version': '1.0.0',
        'accept-language': 'es',
        authorization: 'Bearer x',
      },
    };
    let called = false;

    middleware.use(req, {} as any, () => {
      called = true;
    });

    assert.strictEqual(called, true);
    assert.strictEqual(req.headers.logData.path, '/defaults');
    assert.strictEqual(req.headers.logData.appVersion, '1.0.0');
    assert.strictEqual(req.headers.logData.authorization, 'Bearer x');
  });

  it('uses "" when there is no authorization', () => {
    const req: any = {
      path: '/defaults',
      method: 'GET',
      originalUrl: '/defaults',
      headers: { 'l-api-version': '1.0.0' },
    };
    let called = false;

    middleware.use(req, {} as any, () => {
      called = true;
    });

    assert.strictEqual(called, true);
    assert.strictEqual(req.headers.logData.authorization, '');
  });

  it('keeps the pre-existing logData', () => {
    const req: any = {
      path: '/defaults',
      method: 'POST',
      originalUrl: '/defaults',
      headers: {
        'l-api-version': '1.0.0',
        logData: { _user: 'x' },
      },
    };
    let called = false;

    middleware.use(req, {} as any, () => {
      called = true;
    });

    assert.strictEqual(called, true);
    assert.strictEqual(req.headers.logData._user, 'x');
    assert.strictEqual(req.headers.logData.method, 'POST');
  });
});
