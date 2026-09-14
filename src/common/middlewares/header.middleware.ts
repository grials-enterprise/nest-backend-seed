import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { validators } from '../ajv/ajv.js';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    validators.validateData('headersValidationData', req.headers);

    const logData = {
      path: req.path,
      method: req.method,
      originalPath: req.originalUrl,
      language: req.headers['accept-language'],
      appVersion: req.headers['l-api-version'],
      licenseKey: req.headers['licenseKey'],
      authorization: req.headers['authorization'] ?? '',
    };

    (req.headers as any).logData = {
      ...((req.headers as any)?.logData || {}),
      ...logData,
    };
    next();
  }
}
