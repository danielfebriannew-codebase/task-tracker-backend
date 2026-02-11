import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../../../common/enums/transaction-type.enum';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Salary', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    enum: TransactionType,
    example: TransactionType.INCOME,
    description: 'Category type',
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    example: '#4CAF50',
    description: 'Hex color code',
  })
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color must be a valid hex color code (e.g., #4CAF50)',
  })
  color: string;
}
