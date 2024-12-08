"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const moysklad_module_1 = require("./moysklad/moysklad.module");
const typeorm_config_1 = require("./config/typeorm.config");
const health_controller_1 = require("./controllers/health.controller");
const telegram_module_1 = require("./telegram/telegram.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env'
            }),
            typeorm_1.TypeOrmModule.forRoot(typeorm_config_1.typeOrmConfig),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            moysklad_module_1.MoySkladModule,
            telegram_module_1.TelegramModule,
        ],
        controllers: [health_controller_1.HealthController],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map