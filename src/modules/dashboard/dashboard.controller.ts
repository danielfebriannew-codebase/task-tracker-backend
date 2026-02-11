import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { SummaryResponseDto } from './dto/summary-response.dto';
import { CategoryStatsDto } from './dto/category-stats-response.dto';
import { ApiResponse } from '../../common/dto/api-response.dto';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get financial summary' })
  @SwaggerResponse({
    status: 200,
    description: 'Returns total income, expense, and balance',
    type: SummaryResponseDto,
  })
  async getSummary(): Promise<ApiResponse<SummaryResponseDto>> {
    const summary = await this.dashboardService.getSummary();
    return ApiResponse.success(summary, 'Summary retrieved successfully');
  }

  @Get('by-category')
  @ApiOperation({ summary: 'Get statistics grouped by category' })
  @SwaggerResponse({
    status: 200,
    description: 'Returns aggregated data per category',
    type: [CategoryStatsDto],
  })
  async getStatsByCategory(): Promise<ApiResponse<CategoryStatsDto[]>> {
    const stats = await this.dashboardService.getStatsByCategory();
    return ApiResponse.success(stats, 'Category statistics retrieved successfully');
  }
}
