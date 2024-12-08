import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { hashPassword, comparePasswords } from '../utils/password';
import { generateToken } from '../utils/token';

export class AuthController {
  async checkStatus(req: Request, res: Response) {
    try {
      const { clientCode } = req.body;
      const userRepository = getRepository(User);
      
      const user = await userRepository.findOne({ where: { clientCode } });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const hasPassword = Boolean(user.password);
      return res.json({ hasPassword });
    } catch (error) {
      console.error('Error in checkStatus:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async setPassword(req: Request, res: Response) {
    try {
      const { clientCode, password } = req.body;
      const userRepository = getRepository(User);
      
      const user = await userRepository.findOne({ where: { clientCode } });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const hashedPassword = await hashPassword(password);
      user.password = hashedPassword;

      await userRepository.save(user);

      const token = generateToken(user);
      return res.json({ token });
    } catch (error) {
      console.error('Error in setPassword:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { clientCode, password } = req.body;
      const userRepository = getRepository(User);
      
      const user = await userRepository.findOne({ where: { clientCode } });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.password) {
        return res.status(400).json({ error: 'Password not set' });
      }

      const isValid = await comparePasswords(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const token = generateToken(user);
      return res.json({ token });
    } catch (error) {
      console.error('Error in login:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async loginWithTelegram(req: Request, res: Response) {
    try {
      const { telegramId } = req.body;
      const userRepository = getRepository(User);
      
      const user = await userRepository.findOne({ where: { telegramId: telegramId.toString() } });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const token = generateToken(user);
      return res.json({ token });
    } catch (error) {
      console.error('Error in loginWithTelegram:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async registerWithTelegram(req: Request, res: Response) {
    try {
      const { telegramId, telegramUsername, firstName, lastName, photoUrl } = req.body;
      const userRepository = getRepository(User);

      // Проверяем, существует ли пользователь
      let user = await userRepository.findOne({ where: { telegramId: telegramId.toString() } });

      if (user) {
        // Если пользователь существует, обновляем его данные
        user.telegramUsername = telegramUsername;
        user.firstName = firstName;
        user.lastName = lastName;
        user.telegramPhotoUrl = photoUrl;
      } else {
        // Если пользователь не существует, создаем нового
        user = userRepository.create({
          telegramId: telegramId.toString(),
          telegramUsername,
          firstName,
          lastName,
          telegramPhotoUrl: photoUrl,
          isVerified: true, // Пользователи из Telegram считаются верифицированными
        });
      }

      await userRepository.save(user);

      const token = generateToken(user);
      return res.json({ token });
    } catch (error) {
      console.error('Error in registerWithTelegram:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async checkTelegramStatus(req: Request, res: Response) {
    try {
      const { telegramId } = req.query;
      
      if (!telegramId) {
        return res.status(400).json({ error: 'Telegram ID is required' });
      }

      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { telegramId: telegramId.toString() } });

      return res.json({
        exists: !!user,
        user: user ? {
          id: user.id,
          telegramId: user.telegramId,
          telegramUsername: user.telegramUsername,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
        } : null
      });
    } catch (error) {
      console.error('Error in checkTelegramStatus:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
