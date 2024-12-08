import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class TelegramController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async handleStart(req: Request, res: Response): Promise<Response> {
    try {
      const { telegram_id, first_name, last_name, username, phone } = req.body;

      if (!telegram_id || !first_name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await this.userService.registerWithTelegram({
        telegram_id,
        first_name,
        last_name,
        username,
        phone
      });

      return res.json(result);
    } catch (error) {
      console.error('Telegram start error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async handleVerify(req: Request, res: Response): Promise<Response> {
    try {
      const { telegram_id, auth_code } = req.body;

      if (!telegram_id || !auth_code) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await this.userService.verifyAuthCode(telegram_id, auth_code);
      return res.json(result);
    } catch (error) {
      console.error('Telegram verify error:', error);
      return res.status(500).json({ error: 'Invalid auth code' });
    }
  }
} 