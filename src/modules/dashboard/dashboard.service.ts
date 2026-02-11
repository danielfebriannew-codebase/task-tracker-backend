import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { SummaryResponseDto } from './dto/summary-response.dto';
import { CategoryStatsDto } from './dto/category-stats-response.dto';
import { TransactionType } from '../../common/enums/transaction-type.enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async getSummary(): Promise<SummaryResponseDto> {
    const incomeResult = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .where('transaction.type = :type', { type: TransactionType.INCOME })
      .getRawOne();

    const expenseResult = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .where('transaction.type = :type', { type: TransactionType.EXPENSE })
      .getRawOne();

    const totalIncome = parseFloat(incomeResult?.total || '0');
    const totalExpense = parseFloat(expenseResult?.total || '0');

    this.logger.info('Dashboard summary calculated', {
      context: 'DashboardService',
      totalIncome,
      totalExpense,
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  async getStatsByCategory(): Promise<CategoryStatsDto[]> {
    const stats = await this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .select('transaction.categoryId', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('category.color', 'categoryColor')
      .addSelect('category.type', 'type')
      .addSelect('SUM(transaction.amount)', 'total')
      .addSelect('COUNT(transaction.id)', 'transactionCount')
      .groupBy('transaction.categoryId')
      .addGroupBy('category.name')
      .addGroupBy('category.color')
      .addGroupBy('category.type')
      .orderBy('total', 'DESC')
      .getRawMany();

    this.logger.info('Category stats calculated', {
      context: 'DashboardService',
      categoryCount: stats.length,
    });

    return stats.map((stat) => ({
      categoryId: stat.categoryId,
      categoryName: stat.categoryName,
      categoryColor: stat.categoryColor,
      type: stat.type,
      total: parseFloat(stat.total),
      transactionCount: parseInt(stat.transactionCount, 10),
    }));
  }
}
