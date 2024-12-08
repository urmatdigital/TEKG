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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoySkladController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const moysklad_service_1 = require("../services/moysklad.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const moysklad_dto_1 = require("../dto/moysklad.dto");
let MoySkladController = class MoySkladController {
    constructor(moyskladService) {
        this.moyskladService = moyskladService;
    }
    async createCustomer(createCustomerDto) {
        return await this.moyskladService.upsertCustomer(createCustomerDto);
    }
    async updateCustomer(clientCode, updateCustomerDto) {
        return await this.moyskladService.upsertCustomer(Object.assign(Object.assign({}, updateCustomerDto), { clientCode }));
    }
    async getCustomer(clientCode) {
        return await this.moyskladService.getCustomer(clientCode);
    }
    async getCustomerBalance(clientCode) {
        return await this.moyskladService.getCustomerBalance(clientCode);
    }
    async getCustomerOrders(clientCode) {
        return await this.moyskladService.getCustomerOrders(clientCode);
    }
    async getCustomerPayments(clientCode) {
        return await this.moyskladService.getCustomerPayments(clientCode);
    }
};
exports.MoySkladController = MoySkladController;
__decorate([
    (0, common_1.Post)('customers'),
    (0, swagger_1.ApiOperation)({ summary: 'Создать нового контрагента' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Контрагент успешно создан',
        type: moysklad_dto_1.CustomerResponseDto
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [moysklad_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], MoySkladController.prototype, "createCustomer", null);
__decorate([
    (0, common_1.Put)('customers/:clientCode'),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить данные контрагента' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Данные контрагента обновлены',
        type: moysklad_dto_1.CustomerResponseDto
    }),
    __param(0, (0, common_1.Param)('clientCode')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, moysklad_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], MoySkladController.prototype, "updateCustomer", null);
__decorate([
    (0, common_1.Get)('customers/:clientCode'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить информацию о контрагенте' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Информация о контрагенте',
        type: moysklad_dto_1.CustomerResponseDto
    }),
    __param(0, (0, common_1.Param)('clientCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MoySkladController.prototype, "getCustomer", null);
__decorate([
    (0, common_1.Get)('customers/:clientCode/balance'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить баланс контрагента' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Баланс контрагента',
        type: moysklad_dto_1.CustomerBalanceDto
    }),
    __param(0, (0, common_1.Param)('clientCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MoySkladController.prototype, "getCustomerBalance", null);
__decorate([
    (0, common_1.Get)('customers/:clientCode/orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить заказы контрагента' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Список заказов контрагента',
        type: [moysklad_dto_1.CustomerOrderDto]
    }),
    __param(0, (0, common_1.Param)('clientCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MoySkladController.prototype, "getCustomerOrders", null);
__decorate([
    (0, common_1.Get)('customers/:clientCode/payments'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить платежи контрагента' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Список платежей контрагента',
        type: [moysklad_dto_1.CustomerPaymentDto]
    }),
    __param(0, (0, common_1.Param)('clientCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MoySkladController.prototype, "getCustomerPayments", null);
exports.MoySkladController = MoySkladController = __decorate([
    (0, swagger_1.ApiTags)('МойСклад'),
    (0, common_1.Controller)('moysklad'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [moysklad_service_1.MoySkladService])
], MoySkladController);
//# sourceMappingURL=moysklad.controller.js.map