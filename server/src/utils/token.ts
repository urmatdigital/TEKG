import jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    clientCode: user.clientCode,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
