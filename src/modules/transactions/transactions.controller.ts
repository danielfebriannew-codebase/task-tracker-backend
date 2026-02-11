import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { Transaction } from './entities/transaction.entity';
import { ApiResponse } from '../../common/dto/api-response.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions with optional filters' })
  @SwaggerResponse({ status: 200, description: 'Returns filtered transactions' })
  async findAll(
    @Query() query: TransactionQueryDto,
  ): Promise<ApiResponse<Transaction[]>> {
    const transactions = await this.transactionsService.findAll(query);
    return ApiResponse.success(transactions, 'Transactions retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @SwaggerResponse({ status: 200, description: 'Returns transaction details' })
  @SwaggerResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@Param('id') id: string): Promise<ApiResponse<Transaction>> {
    const transaction = await this.transactionsService.findOne(id);
    return ApiResponse.success(transaction, 'Transaction retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @SwaggerResponse({
    status: 201,
    description: 'Transaction created successfully',
  })
  @SwaggerResponse({ status: 400, description: 'Invalid category ID' })
  async create(@Body() dto: CreateTransactionDto): Promise<ApiResponse<Transaction>> {
    const transaction = await this.transactionsService.create(dto);
    return ApiResponse.created(transaction);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  @SwaggerResponse({
    status: 200,
    description: 'Transaction updated successfully',
  })
  @SwaggerResponse({ status: 404, description: 'Transaction not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ): Promise<ApiResponse<Transaction>> {
    const transaction = await this.transactionsService.update(id, dto);
    return ApiResponse.updated(transaction);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a transaction' })
  @SwaggerResponse({
    status: 200,
    description: 'Transaction deleted successfully',
  })
  @SwaggerResponse({ status: 404, description: 'Transaction not found' })
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.transactionsService.delete(id);
    return ApiResponse.deleted();
  }
}
