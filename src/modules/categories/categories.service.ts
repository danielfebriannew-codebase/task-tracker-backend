import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async findAll(): Promise<Category[]> {
    this.logger.info('Fetching all categories', {
      context: 'CategoriesService',
    });
    return this.categoryRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    // Check duplicate name
    const existing = await this.categoryRepository.findOne({
      where: { name: dto.name, type: dto.type },
    });

    if (existing) {
      throw new ConflictException(
        `Category with name '${dto.name}' and type '${dto.type}' already exists`,
      );
    }

    const category = this.categoryRepository.create(dto);
    const saved = await this.categoryRepository.save(category);

    this.logger.info('Category created', {
      context: 'CategoriesService',
      categoryId: saved.id,
    });

    return saved;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    // Check duplicate name if name is being updated
    if (dto.name || dto.type) {
      const existing = await this.categoryRepository.findOne({
        where: {
          name: dto.name || category.name,
          type: dto.type || category.type,
        },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          'Category name already exists for this type',
        );
      }
    }

    Object.assign(category, dto);
    const updated = await this.categoryRepository.save(category);

    this.logger.info('Category updated', {
      context: 'CategoriesService',
      categoryId: id,
    });

    return updated;
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['transactions'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    if (category.transactions && category.transactions.length > 0) {
      throw new ConflictException(
        'Cannot delete category with existing transactions',
      );
    }

    await this.categoryRepository.remove(category);

    this.logger.info('Category deleted', {
      context: 'CategoriesService',
      categoryId: id,
    });
  }
}
