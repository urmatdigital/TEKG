import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Код клиента в формате TE-XXXX',
    example: 'TE-0001'
  })
  clientCode: string;

  @ApiProperty({
    description: 'Имя клиента',
    example: 'Урмат'
  })
  firstName: string;

  @ApiProperty({
    description: 'Фамилия клиента',
    example: 'Мырзабеков'
  })
  lastName: string;

  @ApiProperty({
    description: 'Отчество клиента',
    example: 'Мырзабекович',
    required: false
  })
  middleName?: string;

  @ApiProperty({
    description: 'Номер телефона',
    example: '+996700123456'
  })
  phone: string;

  @ApiProperty({
    description: 'Email клиента',
    example: 'user@example.com',
    required: false
  })
  email?: string;

  @ApiProperty({
    description: 'Дополнительная информация о клиенте',
    example: 'VIP клиент',
    required: false
  })
  description?: string;
}

export class CustomerResponseDto {
  @ApiProperty({
    description: 'ID контрагента в МойСклад',
    example: 'a7a4e21a-b6f9-11ee-0a80-0fe500000000'
  })
  id: string;

  @ApiProperty({
    description: 'Полное имя контрагента',
    example: 'Мырзабеков Урмат Мырзабекович'
  })
  name: string;

  @ApiProperty({
    description: 'Код клиента',
    example: 'TE-0001'
  })
  code: string;

  @ApiProperty({
    description: 'Телефон',
    example: '+996700123456'
  })
  phone: string;

  @ApiProperty({
    description: 'Email',
    example: 'user@example.com'
  })
  email: string;
}

export class CustomerBalanceDto {
  @ApiProperty({
    description: 'Текущий баланс',
    example: 1000.50
  })
  balance: number;

  @ApiProperty({
    description: 'Сумма кредита',
    example: 0
  })
  credit: number;

  @ApiProperty({
    description: 'Сумма дебета',
    example: 1000.50
  })
  debit: number;
}

export class CustomerOrderDto {
  @ApiProperty({
    description: 'ID заказа',
    example: 'b7a4e21a-b6f9-11ee-0a80-0fe500000001'
  })
  id: string;

  @ApiProperty({
    description: 'Номер заказа',
    example: 'ЗК-00001'
  })
  name: string;

  @ApiProperty({
    description: 'Дата заказа',
    example: '2024-01-15 10:00:00'
  })
  moment: string;

  @ApiProperty({
    description: 'Сумма заказа',
    example: 5000.00
  })
  sum: number;

  @ApiProperty({
    description: 'Статус заказа',
    example: { name: 'Новый', color: 12345 }
  })
  state: {
    name: string;
    color: number;
  };
}

export class CustomerPaymentDto {
  @ApiProperty({
    description: 'ID платежа',
    example: 'c7a4e21a-b6f9-11ee-0a80-0fe500000002'
  })
  id: string;

  @ApiProperty({
    description: 'Дата платежа',
    example: '2024-01-15 11:00:00'
  })
  moment: string;

  @ApiProperty({
    description: 'Сумма платежа',
    example: 1000.00
  })
  sum: number;
}
