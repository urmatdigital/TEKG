import { sign, verify } from 'jsonwebtoken';
import { config } from '../config';

interface JwtPayload {
  id: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
}

export const generateToken = (payload: JwtPayload): string => {
  return sign(payload, config.jwt.secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = verify(token, config.jwt.secret) as JwtPayload;
    return {
      id: decoded.id,
      email: decoded.email,
      isVerified: decoded.isVerified,
      isAdmin: decoded.isAdmin
    };
  } catch (error) {
    return null;
  }
};

export const extractTokenFromHeader = (header: string): string | null => {
  const [type, token] = header.split(' ');
  return type === 'Bearer' && token ? token : null;
};