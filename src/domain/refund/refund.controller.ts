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
import { RefundService } from './refund.service';
import { CreateRefundDto } from './dto/createRefund.dto';
import { RefundQueryDto } from './dto/refundQuery.dto';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';

@Controller('refunds')
@UseGuards(SessionAuthGuard, RolesGuard)
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  @Post()
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  create(@Request() req, @Body() createRefundDto: CreateRefundDto) {
    const userId = req.user.userId;
    return this.refundService.create(userId, createRefundDto);
  }

  @Get()
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  findAll(@Query() query: RefundQueryDto) {
    return this.refundService.findAll(query);
  }

  @Get('stats')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  getStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.refundService.getRefundStats(startDate, endDate);
  }

  @Get(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.refundService.findOne(id);
  }
}