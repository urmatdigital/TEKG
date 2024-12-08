import jwt from 'jsonwebtoken';

export function generateAuthCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateJWT(userId: string): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(
    { 
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 дней
    },
    process.env.JWT_SECRET
  );
} 