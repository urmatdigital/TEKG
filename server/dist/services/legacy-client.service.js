"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyClientService = void 0;
class LegacyClientService {
    constructor() {
        this.legacyClients = [];
        this.legacyClients = [
            { clientCode: 'TE-3644', fullName: 'Керимкулова Кызсайкал', phone: '701766376' }
        ];
    }
    static getInstance() {
        if (!LegacyClientService.instance) {
            LegacyClientService.instance = new LegacyClientService();
        }
        return LegacyClientService.instance;
    }
    async findByPhone(phone) {
        const normalizedPhone = phone.replace(/\D/g, '').slice(-9);
        return this.legacyClients.find(client => client.phone.replace(/\D/g, '').slice(-9) === normalizedPhone) || null;
    }
    async getLastClientCode() {
        const codes = this.legacyClients
            .map(client => parseInt(client.clientCode.split('-')[1]))
            .filter(code => !isNaN(code));
        return Math.max(...codes, 7000).toString();
    }
}
exports.LegacyClientService = LegacyClientService;
//# sourceMappingURL=legacy-client.service.js.map