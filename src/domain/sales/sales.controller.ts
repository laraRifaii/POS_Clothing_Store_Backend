import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SaleService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleQueryDto } from './dto/sale-query.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';

@Controller('sales')
@UseGuards(SessionAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  create(@Request() req, @Body() createSaleDto: CreateSaleDto) {
    // Get userId from session user attached by SessionAuthGuard
    const userId = req.user.userId;
    return this.saleService.create(userId, createSaleDto);
  }

  @Get()
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  findAll(@Query() query: SaleQueryDto) {
    return this.saleService.findAll(query);
  }

  @Get('reports')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  getReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.saleService.getSalesReport(startDate, endDate);
  }

  @Get('daily')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  getDailySales(@Query('date') date: string) {
    return this.saleService.getDailySales(date);
  }

  @Get(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.saleService.findOne(id);
  }

  @Get('reports/category-profit')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  getCategoryProfit(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.saleService.getProfitByCategory(startDate, endDate);
  }
}
