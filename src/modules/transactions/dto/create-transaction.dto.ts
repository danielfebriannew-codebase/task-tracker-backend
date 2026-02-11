import {
  IsEnum,
  IsUUID,
  IsNumber,
  IsPositive,
  IsString,
  IsDateString,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../../../common/enums/transaction-type.enum';

export class CreateTransactionDto {
  @ApiProperty({
    enum: TransactionType,
    example: TransactionType.EXPENSE,
    description: 'Transaction type',
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    example: 'uuid-here',
    description: 'Category ID',
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    example: 50000,
    description: 'Transaction amount',
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    example: 'Bought groceries',
    required: false,
    description: 'Transaction description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    example: '2026-02-11',
    description: 'Transaction date (YYYY-MM-DD)',
  })
  @IsDateString()
  transactionDate: string;
}
