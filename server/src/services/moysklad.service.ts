import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export class MoySkladService {
  private static instance: MoySkladService;
  private readonly baseUrl: string;
  private readonly auth: string;

  private constructor() {
    this.baseUrl = 'https://api.moysklad.ru/api/remap/1.2';
    this.auth = Buffer.from(`${process.env.MOYSKLAD_LOGIN}:${process.env.MOYSKLAD_PASSWORD}`).toString('base64');
  }

  public static getInstance(): MoySkladService {
    if (!MoySkladService.instance) {
      MoySkladService.instance = new MoySkladService();
    }
    return MoySkladService.instance;
  }

  private async request(method: string, endpoint: string, data?: any) {
    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json'
        },
        data
      });
      return response.data;
    } catch (error) {
      console.error('МойСклад API error:', error);
      throw error;
    }
  }

  // Получение информации о клиенте
  async getCustomer(clientCode: string) {
    try {
      const response = await this.request('GET', '/entity/counterparty', {
        filter: { code: clientCode }
      });
      return response.rows[0];
    } catch (error) {
      console.error('Ошибка при получении данных клиента из МойСклад:', error);
      return null;
    }
  }

  // Создание или обновление клиента
  async upsertCustomer(userData: {
    clientCode: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) {
    try {
      const existingCustomer = await this.getCustomer(userData.clientCode);
      const customerData = {
        name: `${userData.lastName} ${userData.firstName}`,
        code: userData.clientCode,
        phone: userData.phone,
        // Добавьте другие необходимые поля
      };

      if (existingCustomer) {
        return await this.request('PUT', `/entity/counterparty/${existingCustomer.id}`, customerData);
      } else {
        return await this.request('POST', '/entity/counterparty', customerData);
      }
    } catch (error) {
      console.error('Ошибка при обновлении данных клиента в МойСклад:', error);
      return null;
    }
  }

  // Получение баланса клиента
  async getCustomerBalance(clientCode: string) {
    try {
      const customer = await this.getCustomer(clientCode);
      if (!customer) return 0;

      const response = await this.request('GET', '/report/counterparty/payments', {
        filter: { counterparty: customer.id }
      });

      return response.rows[0]?.balance || 0;
    } catch (error) {
      console.error('Ошибка при получении баланса клиента из МойСклад:', error);
      return 0;
    }
  }

  // Получение заказов клиента
  async getCustomerOrders(clientCode: string) {
    try {
      const customer = await this.getCustomer(clientCode);
      if (!customer) return [];

      const response = await this.request('GET', '/entity/customerorder', {
        filter: { agent: customer.id }
      });

      return response.rows;
    } catch (error) {
      console.error('Ошибка при получении заказов клиента из МойСклад:', error);
      return [];
    }
  }
}
