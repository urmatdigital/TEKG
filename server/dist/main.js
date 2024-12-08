"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const swagger_config_1 = require("./config/swagger.config");
const dotenv = __importStar(require("dotenv"));
const envPath = (0, path_1.join)(__dirname, '../.env');
dotenv.config({ path: envPath });
console.log('[Server] Environment variables loaded from:', envPath);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? 'Present' : 'Missing');
console.log('- CLIENT_URL:', process.env.CLIENT_URL);
async function bootstrap() {
    try {
        console.log('[Server] Starting server...');
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['error', 'warn', 'log', 'debug', 'verbose'],
        });
        const configService = app.get(config_1.ConfigService);
        const port = configService.get('PORT', 5000);
        app.enableCors();
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }));
        app.getHttpAdapter().get('/health', (req, res) => {
            res.status(200).send('OK');
        });
        app.setGlobalPrefix('api', {
            exclude: ['/health'],
        });
        (0, swagger_config_1.setupSwagger)(app);
        await app.listen(port, '0.0.0.0');
        console.log(`[Server] Application is running on: http://localhost:${port}`);
        console.log(`[Server] Swagger documentation is available at: http://localhost:${port}/api/docs`);
    }
    catch (error) {
        console.error('[Server] Failed to start server:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map