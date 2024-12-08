"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.config = {
    port: parseInt(process.env.PORT || '3001', 10),
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'tekg',
        ssl: process.env.DB_SSL === 'true'
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true
    },
    telegram: {
        token: process.env.TELEGRAM_BOT_TOKEN || '',
        webhookUrl: process.env.TELEGRAM_WEBHOOK_URL || ''
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '7d'
    }
};
const requiredEnvVars = [
    'DB_HOST',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
    'TELEGRAM_BOT_TOKEN',
    'JWT_SECRET',
    'CORS_ORIGIN'
];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}
try {
    new URL(exports.config.cors.origin);
}
catch (error) {
    throw new Error('Invalid URL in configuration');
}
if (isNaN(exports.config.port) || exports.config.port < 1 || exports.config.port > 65535) {
    throw new Error('Invalid port number in configuration');
}
//# sourceMappingURL=index.js.map