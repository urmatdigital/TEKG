"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const requiredEnvVars = [
    'TELEGRAM_BOT_TOKEN',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET'
];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}
exports.config = {
    server: {
        port: parseInt(process.env.PORT || '5000', 10),
        baseUrl: process.env.BASE_URL || 'http://localhost:5000'
    },
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        webhookDomain: process.env.TELEGRAM_WEBHOOK_DOMAIN,
        webhookPath: process.env.TELEGRAM_WEBHOOK_PATH
    },
    supabase: {
        url: process.env.SUPABASE_URL,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        jwtSecret: process.env.JWT_SECRET
    }
};
//# sourceMappingURL=config.js.map