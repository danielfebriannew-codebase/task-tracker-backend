import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async findAll(query: TransactionQueryDto): Promise<Transaction[]> {
    const where: any = {};

    if (query.type) {
      where.type = query.type;
    }

    // Date filtering
    if (query.startDate && query.endDate) {
      where.transactionDate = Between(query.startDate, query.endDate);
    } else if (query.startDate) {
      where.transactionDate = MoreThanOrEqual(query.startDate);
    } else if (query.endDate) {
      where.transactionDate = LessThanOrEqual(query.endDate);
    }

    this.logger.info('Fetching transactions', {
      context: 'TransactionsService',
      filters: query,
    });

    return this.transactionRepository.find({
      where,
      relations: ['category'],
      order: { transactionDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID '${id}' not found`);
    }

    return transaction;
  }

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create(dto);

    try {
      const saved = await this.transactionRepository.save(transaction);

      this.logger.info('Transaction created', {
        context: 'TransactionsService',
        transactionId: saved.id,
      });

      return this.findOne(saved.id);
    } catch (error) {
      if (error.code === '23503') {
        // Foreign key violation
        throw new BadRequestException('Invalid category ID');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.findOne(id);

    Object.assign(transaction, dto);

    try {
      await this.transactionRepository.save(transaction);

      this.logger.info('Transaction updated', {
        context: 'TransactionsService',
        transactionId: id,
      });

      return this.findOne(id);
    } catch (error) {
      if (error.code === '23503') {
        throw new BadRequestException('Invalid category ID');
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const transaction = await this.findOne(id);
    await this.transactionRepository.remove(transaction);

    this.logger.info('Transaction deleted', {
      context: 'TransactionsService',
      transactionId: id,
    });
  }
}
