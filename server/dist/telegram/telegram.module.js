"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
const legacy_client_entity_1 = require("../auth/entities/legacy-client.entity");
const referral_transaction_entity_1 = require("../auth/entities/referral-transaction.entity");
const telegram_service_1 = require("./services/telegram.service");
const user_service_1 = require("./services/user.service");
const command_handler_1 = require("./handlers/command.handler");
const start_handler_1 = require("./handlers/start.handler");
const contact_handler_1 = require("./handlers/contact.handler");
const text_handler_1 = require("./handlers/text.handler");
const help_handler_1 = require("./handlers/help.handler");
const telegram_controller_1 = require("./controllers/telegram.controller");
const config_1 = require("@nestjs/config");
const moysklad_service_1 = require("../services/moysklad.service");
let TelegramModule = class TelegramModule {
    constructor(telegramService) {
        this.telegramService = telegramService;
    }
    async onModuleInit() {
        await this.telegramService.start();
    }
    async onModuleDestroy() {
        await this.telegramService.stop();
    }
};
exports.TelegramModule = TelegramModule;
exports.TelegramModule = TelegramModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                legacy_client_entity_1.LegacyClient,
                referral_transaction_entity_1.ReferralTransaction
            ]),
            config_1.ConfigModule
        ],
        controllers: [telegram_controller_1.TelegramController],
        providers: [
            telegram_service_1.TelegramService,
            user_service_1.UserService,
            moysklad_service_1.MoySkladService,
            command_handler_1.CommandHandler,
            start_handler_1.StartHandler,
            contact_handler_1.ContactHandler,
            text_handler_1.TextHandler,
            help_handler_1.HelpHandler,
        ],
        exports: [telegram_service_1.TelegramService, user_service_1.UserService],
    }),
    __metadata("design:paramtypes", [telegram_service_1.TelegramService])
], TelegramModule);
//# sourceMappingURL=telegram.module.js.map