import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { 
  IMoySkladCustomer, 
  IMoySkladOrder, 
  IMoySkladPayment, 
  IMoySkladBalance 
} from './interfaces/moysklad.interface';

@Injectable()
export class MoySkladService {
  private readonly baseUrl: string;
  private readonly auth: string;
  private readonly CUSTOM_FIELDS: {
    firstName: string;
    middleName: string;
    lastName: string;
  };

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = 'https://api.moysklad.ru/api/remap/1.2';
    this.auth = Buffer.from(
      `${this.configService.get('MOYSKLAD_LOGIN')}:${this.configService.get('MOYSKLAD_PASSWORD')}`
    ).toString('base64');
    
    this.CUSTOM_FIELDS = {
      firstName: this.configService.get('MOYSKLAD_FIRSTNAME_ATTR_ID'),
      middleName: this.configService.get('MOYSKLAD_MIDDLENAME_ATTR_ID'),
      lastName: this.configService.get('MOYSKLAD_LASTNAME_ATTR_ID')
    };
  }

  /**
   * Базовый метод для отправки запросов к API МойСклад
   */
  private async request<T>(method: string, endpoint: string, data?: any): Promise<T> {
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
      console.error('МойСклад API error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Создает или обновляет контрагента в МойСклад
   */
  async upsertCustomer(data: {
    clientCode: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }): Promise<IMoySkladCustomer> {
    try {
      // Сначала ищем контрагента по коду
      const searchResponse = await this.request<{ rows: IMoySkladCustomer[] }>(
        'GET',
        `/entity/counterparty?filter=code=${data.clientCode}`
      );

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
        // Обновляем существующего контрагента
        const customerId = searchResponse.rows[0].id;
        return this.request<IMoySkladCustomer>(
          'PUT',
          `/entity/counterparty/${customerId}`,
          customerData
        );
      } else {
        // Создаем нового контрагента
        return this.request<IMoySkladCustomer>(
          'POST',
          '/entity/counterparty',
          customerData
        );
      }
    } catch (error) {
      console.error('Error upserting customer in МойСклад:', error);
      throw error;
    }
  }

  /**
   * Получает баланс контрагента по его коду
   */
  async getCustomerBalance(clientCode: string): Promise<IMoySkladBalance> {
    const customer = await this.findCustomerByCode(clientCode);
    if (!customer) {
      throw new Error(`Customer with code ${clientCode} not found`);
    }

    return this.request<IMoySkladBalance>(
      'GET',
      `/report/counterparty/byoperations?counterparty.id=${customer.id}`
    );
  }

  /**
   * Получает список заказов контрагента
   */
  async getCustomerOrders(clientCode: string): Promise<IMoySkladOrder[]> {
    const customer = await this.findCustomerByCode(clientCode);
    if (!customer) {
      throw new Error(`Customer with code ${clientCode} not found`);
    }

    const response = await this.request<{ rows: IMoySkladOrder[] }>(
      'GET',
      `/entity/customerorder?filter=agent.id=${customer.id}`
    );
    return response.rows;
  }

  /**
   * Получает список платежей контрагента
   */
  async getCustomerPayments(clientCode: string): Promise<IMoySkladPayment[]> {
    const customer = await this.findCustomerByCode(clientCode);
    if (!customer) {
      throw new Error(`Customer with code ${clientCode} not found`);
    }

    const response = await this.request<{ rows: IMoySkladPayment[] }>(
      'GET',
      `/entity/paymentin?filter=agent.id=${customer.id}`
    );
    return response.rows;
  }

  /**
   * Ищет контрагента по коду
   */
  private async findCustomerByCode(clientCode: string): Promise<IMoySkladCustomer | null> {
    const response = await this.request<{ rows: IMoySkladCustomer[] }>(
      'GET',
      `/entity/counterparty?filter=code=${clientCode}`
    );
    return response.rows[0] || null;
  }
}
