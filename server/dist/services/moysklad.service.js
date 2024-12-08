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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoySkladService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let MoySkladService = class MoySkladService {
    constructor(configService) {
        this.configService = configService;
        this.baseUrl = 'https://api.moysklad.ru/api/remap/1.2';
        this.auth = Buffer.from(`${this.configService.get('MOYSKLAD_LOGIN')}:${this.configService.get('MOYSKLAD_PASSWORD')}`).toString('base64');
        this.CUSTOM_FIELDS = {
            firstName: this.configService.get('MOYSKLAD_FIRSTNAME_ATTR_ID'),
            middleName: this.configService.get('MOYSKLAD_MIDDLENAME_ATTR_ID'),
            lastName: this.configService.get('MOYSKLAD_LASTNAME_ATTR_ID')
        };
    }
    async request(method, endpoint, data) {
        var _a;
        try {
            const response = await (0, axios_1.default)({
                method,
                url: `${this.baseUrl}${endpoint}`,
                headers: {
                    'Authorization': `Basic ${this.auth}`,
                    'Content-Type': 'application/json'
                },
                data
            });
            return response.data;
        }
        catch (error) {
            console.error('МойСклад API error:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw error;
        }
    }
    async upsertCustomer(data) {
        try {
            const searchResponse = await this.request('GET', `/entity/counterparty?filter=code=${data.clientCode}`);
            const customerData = {
                name: `${data.firstName} ${data.lastName}`,
                code: data.clientCode,
                phone: data.phone,
                email: data.email,
                attributes: [
                    {
                        id: this.CUSTOM_FIELDS.firstName,
                        value: data.firstName
                    },
                    {
                        id: this.CUSTOM_FIELDS.lastName,
                        value: data.lastName
                    }
                ]
            };
            if (searchResponse.rows.length > 0) {
                const customerId = searchResponse.rows[0].id;
                return this.request('PUT', `/entity/counterparty/${customerId}`, customerData);
            }
            else {
                return this.request('POST', '/entity/counterparty', customerData);
            }
        }
        catch (error) {
            console.error('Error upserting customer in МойСклад:', error);
            throw error;
        }
    }
    async getCustomerBalance(clientCode) {
        const customer = await this.findCustomerByCode(clientCode);
        if (!customer) {
            throw new Error(`Customer with code ${clientCode} not found`);
        }
        return this.request('GET', `/report/counterparty/byoperations?counterparty.id=${customer.id}`);
    }
    async getCustomerOrders(clientCode) {
        const customer = await this.findCustomerByCode(clientCode);
        if (!customer) {
            throw new Error(`Customer with code ${clientCode} not found`);
        }
        const response = await this.request('GET', `/entity/customerorder?filter=agent.id=${customer.id}`);
        return response.rows;
    }
    async getCustomerPayments(clientCode) {
        const customer = await this.findCustomerByCode(clientCode);
        if (!customer) {
            throw new Error(`Customer with code ${clientCode} not found`);
        }
        const response = await this.request('GET', `/entity/paymentin?filter=agent.id=${customer.id}`);
        return response.rows;
    }
    async findCustomerByCode(clientCode) {
        const response = await this.request('GET', `/entity/counterparty?filter=code=${clientCode}`);
        return response.rows[0] || null;
    }
};
exports.MoySkladService = MoySkladService;
exports.MoySkladService = MoySkladService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MoySkladService);
//# sourceMappingURL=moysklad.service.js.map