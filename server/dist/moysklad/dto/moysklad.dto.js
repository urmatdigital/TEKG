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
exports.CustomerPaymentDto = exports.CustomerOrderDto = exports.CustomerBalanceDto = exports.CustomerResponseDto = exports.CreateCustomerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateCustomerDto {
}
exports.CreateCustomerDto = CreateCustomerDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Код клиента в формате TE-XXXX',
        example: 'TE-0001'
    }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "clientCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Имя клиента',
        example: 'Урмат'
    }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Фамилия клиента',
        example: 'Мырзабеков'
    }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Отчество клиента',
        example: 'Мырзабекович',
        required: false
    }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Номер телефона',
        example: '+996700123456'
    }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email клиента',
        example: 'user@example.com',
        required: false
    }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дополнительная информация о клиенте',
        example: 'VIP клиент',
        required: false
    }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "description", void 0);
class CustomerResponseDto {
}
exports.CustomerResponseDto = CustomerResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID контрагента в МойСклад',
        example: 'a7a4e21a-b6f9-11ee-0a80-0fe500000000'
    }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Полное имя контрагента',
        example: 'Мырзабеков Урмат Мырзабекович'
    }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Код клиента',
        example: 'TE-0001'
    }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Телефон',
        example: '+996700123456'
    }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email',
        example: 'user@example.com'
    }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "email", void 0);
class CustomerBalanceDto {
}
exports.CustomerBalanceDto = CustomerBalanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Текущий баланс',
        example: 1000.50
    }),
    __metadata("design:type", Number)
], CustomerBalanceDto.prototype, "balance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Сумма кредита',
        example: 0
    }),
    __metadata("design:type", Number)
], CustomerBalanceDto.prototype, "credit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Сумма дебета',
        example: 1000.50
    }),
    __metadata("design:type", Number)
], CustomerBalanceDto.prototype, "debit", void 0);
class CustomerOrderDto {
}
exports.CustomerOrderDto = CustomerOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID заказа',
        example: 'b7a4e21a-b6f9-11ee-0a80-0fe500000001'
    }),
    __metadata("design:type", String)
], CustomerOrderDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Номер заказа',
        example: 'ЗК-00001'
    }),
    __metadata("design:type", String)
], CustomerOrderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата заказа',
        example: '2024-01-15 10:00:00'
    }),
    __metadata("design:type", String)
], CustomerOrderDto.prototype, "moment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Сумма заказа',
        example: 5000.00
    }),
    __metadata("design:type", Number)
], CustomerOrderDto.prototype, "sum", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус заказа',
        example: { name: 'Новый', color: 12345 }
    }),
    __metadata("design:type", Object)
], CustomerOrderDto.prototype, "state", void 0);
class CustomerPaymentDto {
}
exports.CustomerPaymentDto = CustomerPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID платежа',
        example: 'c7a4e21a-b6f9-11ee-0a80-0fe500000002'
    }),
    __metadata("design:type", String)
], CustomerPaymentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Дата платежа',
        example: '2024-01-15 11:00:00'
    }),
    __metadata("design:type", String)
], CustomerPaymentDto.prototype, "moment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Сумма платежа',
        example: 1000.00
    }),
    __metadata("design:type", Number)
], CustomerPaymentDto.prototype, "sum", void 0);
//# sourceMappingURL=moysklad.dto.js.map