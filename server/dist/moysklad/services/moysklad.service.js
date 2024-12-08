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
exports.MoySkladService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let MoySkladService = class MoySkladService {
    constructor(configService) {
        this.configService = configService;
        this.apiUrl = 'https://api.moysklad.ru/api/remap/1.2';
        this.login = this.configService.get('MOYSKLAD_LOGIN');
        this.password = this.configService.get('MOYSKLAD_PASSWORD');
        if (!this.login || !this.password) {
            console.warn('МойСклад: отсутствуют учетные данные в переменных окружения');
        }
    }
    getAuthHeader() {
        return `Basic ${Buffer.from(`${this.login}:${this.password}`).toString('base64')}`;
    }
    async getCustomer(clientCode) {
        try {
            const response = await fetch(`${this.apiUrl}/entity/counterparty?filter=code=${clientCode}`, {
                headers: {
                    'Authorization': this.getAuthHeader(),
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Ошибка получения контрагента: ${response.statusText}`);
            }
            const data = await response.json();
            const customer = data.rows[0];
            if (!customer) {
                throw new common_1.BadRequestException('Контрагент не найден');
            }
            return {
                id: customer.id,
                name: customer.name,
                code: customer.code,
                phone: customer.phone,
                email: customer.email
            };
        }
        catch (error) {
            console.error('Ошибка при получении контрагента:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async upsertCustomer(createCustomerDto) {
        try {
            const searchResponse = await fetch(`${this.apiUrl}/entity/counterparty?filter=code=${createCustomerDto.clientCode}`, {
                headers: {
                    'Authorization': this.getAuthHeader(),
                    'Content-Type': 'application/json'
                }
            });
            if (!searchResponse.ok) {
                throw new Error(`Ошибка поиска контрагента: ${searchResponse.statusText}`);
            }
            const searchData = await searchResponse.json();
            const existingCustomer = searchData.rows[0];
            const customerData = Object.assign({ name: `${createCustomerDto.lastName} ${createCustomerDto.firstName} ${createCustomerDto.middleName || ''}`.trim(), code: createCustomerDto.clientCode, phone: createCustomerDto.phone, email: createCustomerDto.email }, (createCustomerDto.description && { description: createCustomerDto.description }));
            let response;
            if (existingCustomer) {
                response = await fetch(`${this.apiUrl}/entity/counterparty/${existingCustomer.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': this.getAuthHeader(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(customerData)
                });
            }
            else {
                response = await fetch(`${this.apiUrl}/entity/counterparty`, {
                    method: 'POST',
                    headers: {
                        'Authorization': this.getAuthHeader(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(customerData)
                });
            }
            if (!response.ok) {
                throw new Error(`Ошибка создания/обновления контрагента: ${response.statusText}`);
            }
            const result = await response.json();
            return {
                id: result.id,
                name: result.name,
                code: result.code,
                phone: result.phone,
                email: result.email
            };
        }
        catch (error) {
            console.error('Ошибка при работе с МойСклад API:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getCustomerBalance(clientCode) {
        try {
            const response = await fetch(`${this.apiUrl}/report/counterparty/byoperations?filter=code=${clientCode}`, {
                headers: {
                    'Authorization': this.getAuthHeader(),
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Ошибка получения баланса: ${response.statusText}`);
            }
            const data = await response.json();
            const customerData = data.rows[0];
            if (!customerData) {
                throw new common_1.BadRequestException('Контрагент не найден');
            }
            return {
                balance: customerData.balance,
                credit: customerData.credit,
                debit: customerData.debit
            };
        }
        catch (error) {
            console.error('Ошибка при получении баланса:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getCustomerOrders(clientCode) {
        try {
            const response = await fetch(`${this.apiUrl}/entity/customerorder?filter=agent.code=${clientCode}`, {
                headers: {
                    'Authorization': this.getAuthHeader(),
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Ошибка получения заказов: ${response.statusText}`);
            }
            const data = await response.json();
            return data.rows.map(order => ({
                id: order.id,
                name: order.name,
                moment: order.moment,
                sum: order.sum,
                state: {
                    name: order.state.name,
                    color: order.state.color
                }
            }));
        }
        catch (error) {
            console.error('Ошибка при получении заказов:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getCustomerPayments(clientCode) {
        try {
            const response = await fetch(`${this.apiUrl}/entity/paymentin?filter=agent.code=${clientCode}`, {
                headers: {
                    'Authorization': this.getAuthHeader(),
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Ошибка получения платежей: ${response.statusText}`);
            }
            const data = await response.json();
            return data.rows.map(payment => ({
                id: payment.id,
                moment: payment.moment,
                sum: payment.sum
            }));
        }
        catch (error) {
            console.error('Ошибка при получении платежей:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.MoySkladService = MoySkladService;
exports.MoySkladService = MoySkladService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MoySkladService);
//# sourceMappingURL=moysklad.service.js.map