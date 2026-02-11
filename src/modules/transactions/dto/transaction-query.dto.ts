import { IsEnum, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../../../common/enums/transaction-type.enum';

export class TransactionQueryDto {
  @ApiPropertyOptional({
    enum: TransactionType,
    description: 'Filter by transaction type',
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional({
    description: 'Filter by category UUID',
    example: 'b0c133d3-7d4b-48db-96ab-b1c1d7a5d836',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'Filter transactions from this date',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
    description: 'Filter transactions until this date',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
