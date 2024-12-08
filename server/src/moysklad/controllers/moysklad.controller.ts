import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MoySkladService } from '../services/moysklad.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  CreateCustomerDto,
  CustomerResponseDto,
  CustomerBalanceDto,
  CustomerOrderDto,
  CustomerPaymentDto
} from '../dto/moysklad.dto';

@ApiTags('МойСклад')
@Controller('moysklad')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MoySkladController {
  constructor(private readonly moyskladService: MoySkladService) {}

  @Post('customers')
  @ApiOperation({ summary: 'Создать нового контрагента' })
  @ApiResponse({
    status: 201,
    description: 'Контрагент успешно создан',
    type: CustomerResponseDto
  })
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto): Promise<CustomerResponseDto> {
    return await this.moyskladService.upsertCustomer(createCustomerDto);
  }

  @Put('customers/:clientCode')
  @ApiOperation({ summary: 'Обновить данные контрагента' })
  @ApiResponse({
    status: 200,
    description: 'Данные контрагента обновлены',
    type: CustomerResponseDto
  })
  async updateCustomer(
    @Param('clientCode') clientCode: string,
    @Body() updateCustomerDto: CreateCustomerDto
  ): Promise<CustomerResponseDto> {
    return await this.moyskladService.upsertCustomer({
      ...updateCustomerDto,
      clientCode
    });
  }

  @Get('customers/:clientCode')
  @ApiOperation({ summary: 'Получить информацию о контрагенте' })
  @ApiResponse({
    status: 200,
    description: 'Информация о контрагенте',
    type: CustomerResponseDto
  })
  async getCustomer(@Param('clientCode') clientCode: string): Promise<CustomerResponseDto> {
    return await this.moyskladService.getCustomer(clientCode);
  }

  @Get('customers/:clientCode/balance')
  @ApiOperation({ summary: 'Получить баланс контрагента' })
  @ApiResponse({
    status: 200,
    description: 'Баланс контрагента',
    type: CustomerBalanceDto
  })
  async getCustomerBalance(@Param('clientCode') clientCode: string): Promise<CustomerBalanceDto> {
    return await this.moyskladService.getCustomerBalance(clientCode);
  }

  @Get('customers/:clientCode/orders')
  @ApiOperation({ summary: 'Получить заказы контрагента' })
  @ApiResponse({
    status: 200,
    description: 'Список заказов контрагента',
    type: [CustomerOrderDto]
  })
  async getCustomerOrders(@Param('clientCode') clientCode: string): Promise<CustomerOrderDto[]> {
    return await this.moyskladService.getCustomerOrders(clientCode);
  }

  @Get('customers/:clientCode/payments')
  @ApiOperation({ summary: 'Получить платежи контрагента' })
  @ApiResponse({
    status: 200,
    description: 'Список платежей контрагента',
    type: [CustomerPaymentDto]
  })
  async getCustomerPayments(@Param('clientCode') clientCode: string): Promise<CustomerPaymentDto[]> {
    return await this.moyskladService.getCustomerPayments(clientCode);
  }
}
