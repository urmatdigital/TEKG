"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramController = void 0;
const UserService_1 = require("../services/UserService");
class TelegramController {
    constructor() {
        this.userService = new UserService_1.UserService();
    }
    async handleStart(req, res) {
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
        }
        catch (error) {
            console.error('Telegram start error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async handleVerify(req, res) {
        try {
            const { telegram_id, auth_code } = req.body;
            if (!telegram_id || !auth_code) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const result = await this.userService.verifyAuthCode(telegram_id, auth_code);
            return res.json(result);
        }
        catch (error) {
            console.error('Telegram verify error:', error);
            return res.status(500).json({ error: 'Invalid auth code' });
        }
    }
}
exports.TelegramController = TelegramController;
//# sourceMappingURL=TelegramController.js.map