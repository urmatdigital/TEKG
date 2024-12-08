import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtUser } from '../guards/jwt-auth.guard';

// Extend Express Request type to include our custom user
declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET) as JwtUser;
      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization || '').split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET) as JwtUser;
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};