"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRequiredEnvVars = checkRequiredEnvVars;
const config_1 = require("../config");
function checkRequiredEnvVars() {
    const missing = [];
    if (!config_1.config.supabase.url)
        missing.push('SUPABASE_URL');
    if (!config_1.config.supabase.serviceRoleKey)
        missing.push('SUPABASE_SERVICE_ROLE_KEY');
    if (!config_1.config.telegram.botToken)
        missing.push('TELEGRAM_BOT_TOKEN');
    if (!config_1.config.server.baseUrl)
        missing.push('BASE_URL');
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}\n` +
            'Please check your .env file');
    }
}
//# sourceMappingURL=checkEnv.js.map