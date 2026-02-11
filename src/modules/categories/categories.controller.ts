import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { ApiResponse } from '../../common/dto/api-response.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @SwaggerResponse({ status: 200, description: 'Returns all categories' })
  async findAll(): Promise<ApiResponse<Category[]>> {
    const categories = await this.categoriesService.findAll();
    return ApiResponse.success(categories, 'Categories retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @SwaggerResponse({ status: 201, description: 'Category created successfully' })
  @SwaggerResponse({ status: 409, description: 'Category already exists' })
  async create(@Body() dto: CreateCategoryDto): Promise<ApiResponse<Category>> {
    const category = await this.categoriesService.create(dto);
    return ApiResponse.created(category);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  @SwaggerResponse({ status: 200, description: 'Category updated successfully' })
  @SwaggerResponse({ status: 404, description: 'Category not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<ApiResponse<Category>> {
    const category = await this.categoriesService.update(id, dto);
    return ApiResponse.updated(category);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a category' })
  @SwaggerResponse({ status: 200, description: 'Category deleted successfully' })
  @SwaggerResponse({ status: 404, description: 'Category not found' })
  @SwaggerResponse({ status: 409, description: 'Category has transactions' })
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.categoriesService.delete(id);
    return ApiResponse.deleted();
  }
}
