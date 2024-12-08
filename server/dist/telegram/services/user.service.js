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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
const legacy_client_entity_1 = require("../../auth/entities/legacy-client.entity");
const referral_transaction_entity_1 = require("../../auth/entities/referral-transaction.entity");
const order_entity_1 = require("../../orders/entities/order.entity");
const bcrypt = __importStar(require("bcrypt"));
const moysklad_service_1 = require("../../services/moysklad.service");
let UserService = class UserService {
    constructor(userRepository, legacyClientRepository, referralTransactionRepository, orderRepository, moyskladService) {
        this.userRepository = userRepository;
        this.legacyClientRepository = legacyClientRepository;
        this.referralTransactionRepository = referralTransactionRepository;
        this.orderRepository = orderRepository;
        this.moyskladService = moyskladService;
    }
    async findByTelegramId(telegramId) {
        return this.userRepository.findOne({
            where: { telegram_id: telegramId }
        });
    }
    async findByPhone(phone) {
        return this.userRepository.findOne({
            where: { phone }
        });
    }
    async findLegacyUserByPhone(phone) {
        return this.legacyClientRepository.findOne({
            where: { phone }
        });
    }
    async findByReferralCode(referralCode) {
        return this.userRepository.findOne({
            where: { referral_code: referralCode }
        });
    }
    async generateNextClientCode() {
        const result = await this.userRepository
            .createQueryBuilder('user')
            .select('MAX(CAST(SUBSTRING(client_code, 4) AS INTEGER))', 'max_code')
            .where("client_code LIKE 'TE-%'")
            .getRawOne();
        const maxCode = (result === null || result === void 0 ? void 0 : result.max_code) || 7000;
        return `TE-${maxCode + 1}`;
    }
    async createUserFromTelegram(data) {
        try {
            const clientCode = await this.generateNextClientCode();
            const user = this.userRepository.create({
                telegram_id: data.telegram_id,
                telegram_username: data.telegram_username,
                telegram_first_name: data.telegram_first_name,
                telegram_last_name: data.telegram_last_name,
                telegram_photo_url: data.telegram_photo_url,
                phone: data.phone,
                client_code: clientCode,
                referral_code: `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                referral_balance: 0,
                cashback_balance: 0
            });
            await this.userRepository.save(user);
            await this.moyskladService.upsertCustomer({
                clientCode: clientCode,
                firstName: data.telegram_first_name || 'Без имени',
                lastName: data.telegram_last_name || 'Без фамилии',
                phone: data.phone || '',
                email: ''
            });
            return user;
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
    async updateUser(userId, data) {
        await this.userRepository.update(userId, data);
        return this.userRepository.findOne({ where: { id: userId } });
    }
    async updateUserByTelegramId(telegramId, data) {
        await this.userRepository.update({ telegram_id: telegramId }, data);
        return this.findByTelegramId(telegramId);
    }
    async upsertUser(userData) {
        const existingUser = await this.findByTelegramId(userData.telegram_id);
        if (existingUser) {
            await this.userRepository.update(existingUser.id, userData);
            return this.userRepository.findOne({ where: { id: existingUser.id } });
        }
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }
    async createReferralTransaction(data) {
        const transaction = this.referralTransactionRepository.create({
            user_id: data.userId,
            referred_user_id: data.referredUserId,
            amount: data.amount,
            type: data.type,
            order_id: data.orderId
        });
        return this.referralTransactionRepository.save(transaction);
    }
    async getReferralTransactions(userId) {
        return this.referralTransactionRepository.find({
            where: [
                { user_id: userId },
                { referred_user_id: userId }
            ],
            order: { created_at: 'DESC' },
            relations: ['user', 'referred_user']
        });
    }
    async createOrUpdateUser(data) {
        let user = await this.findByTelegramId(data.telegram_id);
        if (user) {
            Object.assign(user, data);
            return this.userRepository.save(user);
        }
        user = this.userRepository.create(data);
        user = await this.userRepository.save(user);
        if (data.referred_by) {
            const referrer = await this.findByReferralCode(data.referred_by);
            if (referrer) {
                await this.processReferralBonus(referrer, user);
            }
        }
        return user;
    }
    async setPassword(userId, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userRepository.update(userId, { password: hashedPassword });
    }
    async processReferralBonus(referrer, referred) {
        const referralBonus = 50;
        await this.userRepository.increment({ id: referrer.id }, 'referral_balance', referralBonus);
        await this.referralTransactionRepository.save({
            user_id: referrer.id,
            referred_user_id: referred.id,
            amount: referralBonus,
            type: 'REFERRAL_BONUS'
        });
    }
    async processOrderCommission(orderId, amount) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['user', 'user.referred_by']
        });
        if (!order)
            return;
        const cashbackAmount = amount * 0.02;
        await this.userRepository.increment({ id: order.user.id }, 'cashback_balance', cashbackAmount);
        await this.referralTransactionRepository.save({
            user_id: order.user.id,
            referred_user_id: order.user.id,
            order_id: orderId,
            amount: cashbackAmount,
            type: 'CASHBACK'
        });
        if (order.user.referred_by) {
            const commissionAmount = amount * 0.01;
            await this.userRepository.increment({ id: order.user.referred_by.id }, 'referral_balance', commissionAmount);
            await this.referralTransactionRepository.save({
                user_id: order.user.referred_by.id,
                referred_user_id: order.user.id,
                order_id: orderId,
                amount: commissionAmount,
                type: 'ORDER_COMMISSION'
            });
        }
    }
    async getReferralStats(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['referrals']
        });
        if (!user) {
            throw new Error('User not found');
        }
        const referralsWithStats = await Promise.all(user.referrals.map(async (referral) => {
            const totalOrders = await this.orderRepository.count({
                where: { user_id: referral.id }
            });
            return {
                user: referral,
                totalOrders,
                registrationDate: referral.created_at
            };
        }));
        return {
            totalReferrals: user.referrals.length,
            totalReferralBalance: user.referral_balance,
            totalCashbackBalance: user.cashback_balance,
            referrals: referralsWithStats
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(legacy_client_entity_1.LegacyClient)),
    __param(2, (0, typeorm_1.InjectRepository)(referral_transaction_entity_1.ReferralTransaction)),
    __param(3, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        moysklad_service_1.MoySkladService])
], UserService);
//# sourceMappingURL=user.service.js.map