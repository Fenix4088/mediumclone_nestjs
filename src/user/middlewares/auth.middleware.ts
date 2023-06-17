import { JWT_SECRET } from '@app/config';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    const { authorization: token } = req.headers;

    if (!token) {
      req.user = null;
      next();
    }

    try {
      const decode = verify(token, JWT_SECRET);
      const user = await this.userService.findById(decode.id);

      req.user = user;
    } catch {
      req.user = null;
    } finally {
      next();
    }
  }
}
