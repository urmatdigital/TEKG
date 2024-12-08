import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCustomerDto, CustomerResponseDto, CustomerBalanceDto, CustomerOrderDto, CustomerPaymentDto } from '../dto/moysklad.dto';

@Injectable()
export class MoySkladService {
  private readonly apiUrl: string;
  private readonly login: string;
  private readonly password: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = 'https://api.moysklad.ru/api/remap/1.2';
    this.login = this.configService.get<string>('MOYSKLAD_LOGIN');
    this.password = this.configService.get<string>('MOYSKLAD_PASSWORD');

    if (!this.login || !this.password) {
      console.warn('МойСклад: отсутствуют учетные данные в переменных окружения');
    }
  }

  private getAuthHeader(): string {
    return `Basic ${Buffer.from(`${this.login}:${this.password}`).toString('base64')}`;
  }

  async getCustomer(clientCode: string): Promise<CustomerResponseDto> {
    try {
      const response = await fetch(
        `${this.apiUrl}/entity/counterparty?filter=code=${clientCode}`,
        {
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка получения контрагента: ${response.statusText}`);
      }

      const data = await response.json();
      const customer = data.rows[0];

      if (!customer) {
        throw new BadRequestException('Контрагент не найден');
      }

      return {
        id: customer.id,
        name: customer.name,
        code: customer.code,
        phone: customer.phone,
        email: customer.email
      };
    } catch (error) {
      console.error('Ошибка при получении контрагента:', error);
      throw new BadRequestException(error.message);
    }
  }

  async upsertCustomer(createCustomerDto: CreateCustomerDto): Promise<CustomerResponseDto> {
    try {
      // Поиск существующего контрагента по коду
      const searchResponse = await fetch(
        `${this.apiUrl}/entity/counterparty?filter=code=${createCustomerDto.clientCode}`,
        {
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );

      if (!searchResponse.ok) {
        throw new Error(`Ошибка поиска контрагента: ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();
      const existingCustomer = searchData.rows[0];

      const customerData = {
        name: `${createCustomerDto.lastName} ${createCustomerDto.firstName} ${createCustomerDto.middleName || ''}`.trim(),
        code: createCustomerDto.clientCode,
        phone: createCustomerDto.phone,
        email: createCustomerDto.email,
        ...(createCustomerDto.description && { description: createCustomerDto.description })
      };

      let response;
      if (existingCustomer) {
        // Обновление существующего контрагента
        response = await fetch(
          `${this.apiUrl}/entity/counterparty/${existingCustomer.id}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': this.getAuthHeader(),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
          }
        );
      } else {
        // Создание нового контрагента
        response = await fetch(
          `${this.apiUrl}/entity/counterparty`,
          {
            method: 'POST',
            headers: {
              'Authorization': this.getAuthHeader(),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
          }
        );
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
    } catch (error) {
      console.error('Ошибка при работе с МойСклад API:', error);
      throw new BadRequestException(error.message);
    }
  }

  async getCustomerBalance(clientCode: string): Promise<CustomerBalanceDto> {
    try {
      const response = await fetch(
        `${this.apiUrl}/report/counterparty/byoperations?filter=code=${clientCode}`,
        {
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка получения баланса: ${response.statusText}`);
      }

      const data = await response.json();
      const customerData = data.rows[0];

      if (!customerData) {
        throw new BadRequestException('Контрагент не найден');
      }

      return {
        balance: customerData.balance,
        credit: customerData.credit,
        debit: customerData.debit
      };
    } catch (error) {
      console.error('Ошибка при получении баланса:', error);
      throw new BadRequestException(error.message);
    }
  }

  async getCustomerOrders(clientCode: string): Promise<CustomerOrderDto[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}/entity/customerorder?filter=agent.code=${clientCode}`,
        {
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );

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
    } catch (error) {
      console.error('Ошибка при получении заказов:', error);
      throw new BadRequestException(error.message);
    }
  }

  async getCustomerPayments(clientCode: string): Promise<CustomerPaymentDto[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}/entity/paymentin?filter=agent.code=${clientCode}`,
        {
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка получения платежей: ${response.statusText}`);
      }

      const data = await response.json();
      return data.rows.map(payment => ({
        id: payment.id,
        moment: payment.moment,
        sum: payment.sum
      }));
    } catch (error) {
      console.error('Ошибка при получении платежей:', error);
      throw new BadRequestException(error.message);
    }
  }
}
