import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../../../common/enums/transaction-type.enum';

export class CategoryStatsDto {
  @ApiProperty({ description: 'Category ID' })
  categoryId: string;

  @ApiProperty({ description: 'Category name' })
  categoryName: string;

  @ApiProperty({ description: 'Category color' })
  categoryColor: string;

  @ApiProperty({
    enum: TransactionType,
    description: 'Category type',
  })
  type: TransactionType;

  @ApiProperty({ example: 1500000, description: 'Total amount' })
  total: number;

  @ApiProperty({ example: 5, description: 'Number of transactions' })
  transactionCount: number;
}
