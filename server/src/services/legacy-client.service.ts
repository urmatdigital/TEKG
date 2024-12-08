import { AppDataSource } from '../config/typeorm.config';
import { Repository } from 'typeorm';

interface LegacyClient {
  clientCode: string;
  fullName: string;
  phone: string;
}

export class LegacyClientService {
  private static instance: LegacyClientService;
  private legacyClients: LegacyClient[] = [];

  private constructor() {
    // Инициализируем данные из старой базы
    this.legacyClients = [
      // Здесь будут данные из старой базы
      { clientCode: 'TE-3644', fullName: 'Керимкулова Кызсайкал', phone: '701766376' }
    ];
  }

  public static getInstance(): LegacyClientService {
    if (!LegacyClientService.instance) {
      LegacyClientService.instance = new LegacyClientService();
    }
    return LegacyClientService.instance;
  }

  public async findByPhone(phone: string): Promise<LegacyClient | null> {
    // Нормализуем номер телефона для сравнения
    const normalizedPhone = phone.replace(/\D/g, '').slice(-9);
    return this.legacyClients.find(client => 
      client.phone.replace(/\D/g, '').slice(-9) === normalizedPhone
    ) || null;
  }

  public async getLastClientCode(): Promise<string> {
    const codes = this.legacyClients
      .map(client => parseInt(client.clientCode.split('-')[1]))
      .filter(code => !isNaN(code));
    
    return Math.max(...codes, 7000).toString();
  }
}
