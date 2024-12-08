import { User } from '../entities/user.entity';

export function getUserDisplayName(user: User): string {
  return user.firstName + (user.lastName ? ` ${user.lastName}` : '');
}

export function sanitizeUser(user: User): Partial<User> {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}