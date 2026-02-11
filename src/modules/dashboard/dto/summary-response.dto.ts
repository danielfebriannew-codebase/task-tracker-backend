import { ApiProperty } from '@nestjs/swagger';

export class SummaryResponseDto {
  @ApiProperty({ example: 5000000, description: 'Total income' })
  totalIncome: number;

  @ApiProperty({ example: 3000000, description: 'Total expense' })
  totalExpense: number;

  @ApiProperty({ example: 2000000, description: 'Balance (income - expense)' })
  balance: number;
}
