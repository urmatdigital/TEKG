import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validate-request';
import { body, query } from 'express-validator';

const router = Router();
const authController = new AuthController();

// Валидация для проверки статуса
const checkStatusValidation = [
  body('clientCode')
    .notEmpty()
    .withMessage('Client code is required'),
];

// Валидация для установки пароля
const setPasswordValidation = [
  body('clientCode')
    .notEmpty()
    .withMessage('Client code is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Валидация для входа
const loginValidation = [
  body('clientCode')
    .notEmpty()
    .withMessage('Client code is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Валидация для входа через Telegram
const telegramLoginValidation = [
  body('telegramId')
    .notEmpty()
    .withMessage('Telegram ID is required'),
];

// Валидация для регистрации через Telegram
const telegramRegisterValidation = [
  body('telegramId')
    .notEmpty()
    .withMessage('Telegram ID is required'),
  body('telegramUsername')
    .optional(),
  body('firstName')
    .optional(),
  body('lastName')
    .optional(),
  body('photoUrl')
    .optional()
    .isURL()
    .withMessage('Invalid photo URL'),
];

// Валидация для проверки статуса Telegram
const checkTelegramStatusValidation = [
  query('telegramId')
    .notEmpty()
    .withMessage('Telegram ID is required'),
];

// Маршруты для стандартной аутентификации
router.post(
  '/check-status',
  checkStatusValidation,
  validateRequest,
  authController.checkStatus.bind(authController)
);

router.post(
  '/set-password',
  setPasswordValidation,
  validateRequest,
  authController.setPassword.bind(authController)
);

router.post(
  '/login',
  loginValidation,
  validateRequest,
  authController.login.bind(authController)
);

// Маршруты для Telegram
router.post(
  '/telegram/login',
  telegramLoginValidation,
  validateRequest,
  authController.loginWithTelegram.bind(authController)
);

router.post(
  '/telegram/register',
  telegramRegisterValidation,
  validateRequest,
  authController.registerWithTelegram.bind(authController)
);

router.get(
  '/telegram/check-status',
  checkTelegramStatusValidation,
  validateRequest,
  authController.checkTelegramStatus.bind(authController)
);

export default router;
