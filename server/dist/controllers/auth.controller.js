"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const password_1 = require("../utils/password");
const token_1 = require("../utils/token");
class AuthController {
    async checkStatus(req, res) {
        try {
            const { clientCode } = req.body;
            const userRepository = (0, typeorm_1.getRepository)(user_entity_1.User);
            const user = await userRepository.findOne({ where: { clientCode } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const hasPassword = Boolean(user.password);
            return res.json({ hasPassword });
        }
        catch (error) {
            console.error('Error in checkStatus:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async setPassword(req, res) {
        try {
            const { clientCode, password } = req.body;
            const userRepository = (0, typeorm_1.getRepository)(user_entity_1.User);
            const user = await userRepository.findOne({ where: { clientCode } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const hashedPassword = await (0, password_1.hashPassword)(password);
            user.password = hashedPassword;
            await userRepository.save(user);
            const token = (0, token_1.generateToken)(user);
            return res.json({ token });
        }
        catch (error) {
            console.error('Error in setPassword:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async login(req, res) {
        try {
            const { clientCode, password } = req.body;
            const userRepository = (0, typeorm_1.getRepository)(user_entity_1.User);
            const user = await userRepository.findOne({ where: { clientCode } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (!user.password) {
                return res.status(400).json({ error: 'Password not set' });
            }
            const isValid = await (0, password_1.comparePasswords)(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid password' });
            }
            const token = (0, token_1.generateToken)(user);
            return res.json({ token });
        }
        catch (error) {
            console.error('Error in login:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async loginWithTelegram(req, res) {
        try {
            const { telegramId } = req.body;
            const userRepository = (0, typeorm_1.getRepository)(user_entity_1.User);
            const user = await userRepository.findOne({ where: { telegramId: telegramId.toString() } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const token = (0, token_1.generateToken)(user);
            return res.json({ token });
        }
        catch (error) {
            console.error('Error in loginWithTelegram:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async registerWithTelegram(req, res) {
        try {
            const { telegramId, telegramUsername, firstName, lastName, photoUrl } = req.body;
            const userRepository = (0, typeorm_1.getRepository)(user_entity_1.User);
            let user = await userRepository.findOne({ where: { telegramId: telegramId.toString() } });
            if (user) {
                user.telegramUsername = telegramUsername;
                user.firstName = firstName;
                user.lastName = lastName;
                user.telegramPhotoUrl = photoUrl;
            }
            else {
                user = userRepository.create({
                    telegramId: telegramId.toString(),
                    telegramUsername,
                    firstName,
                    lastName,
                    telegramPhotoUrl: photoUrl,
                    isVerified: true,
                });
            }
            await userRepository.save(user);
            const token = (0, token_1.generateToken)(user);
            return res.json({ token });
        }
        catch (error) {
            console.error('Error in registerWithTelegram:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async checkTelegramStatus(req, res) {
        try {
            const { telegramId } = req.query;
            if (!telegramId) {
                return res.status(400).json({ error: 'Telegram ID is required' });
            }
            const userRepository = (0, typeorm_1.getRepository)(user_entity_1.User);
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
        }
        catch (error) {
            console.error('Error in checkTelegramStatus:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map