"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_request_1 = require("../middlewares/validate-request");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
const checkStatusValidation = [
    (0, express_validator_1.body)('clientCode')
        .notEmpty()
        .withMessage('Client code is required'),
];
const setPasswordValidation = [
    (0, express_validator_1.body)('clientCode')
        .notEmpty()
        .withMessage('Client code is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];
const loginValidation = [
    (0, express_validator_1.body)('clientCode')
        .notEmpty()
        .withMessage('Client code is required'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
];
const telegramLoginValidation = [
    (0, express_validator_1.body)('telegramId')
        .notEmpty()
        .withMessage('Telegram ID is required'),
];
const telegramRegisterValidation = [
    (0, express_validator_1.body)('telegramId')
        .notEmpty()
        .withMessage('Telegram ID is required'),
    (0, express_validator_1.body)('telegramUsername')
        .optional(),
    (0, express_validator_1.body)('firstName')
        .optional(),
    (0, express_validator_1.body)('lastName')
        .optional(),
    (0, express_validator_1.body)('photoUrl')
        .optional()
        .isURL()
        .withMessage('Invalid photo URL'),
];
const checkTelegramStatusValidation = [
    (0, express_validator_1.query)('telegramId')
        .notEmpty()
        .withMessage('Telegram ID is required'),
];
router.post('/check-status', checkStatusValidation, validate_request_1.validateRequest, authController.checkStatus.bind(authController));
router.post('/set-password', setPasswordValidation, validate_request_1.validateRequest, authController.setPassword.bind(authController));
router.post('/login', loginValidation, validate_request_1.validateRequest, authController.login.bind(authController));
router.post('/telegram/login', telegramLoginValidation, validate_request_1.validateRequest, authController.loginWithTelegram.bind(authController));
router.post('/telegram/register', telegramRegisterValidation, validate_request_1.validateRequest, authController.registerWithTelegram.bind(authController));
router.get('/telegram/check-status', checkTelegramStatusValidation, validate_request_1.validateRequest, authController.checkTelegramStatus.bind(authController));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map