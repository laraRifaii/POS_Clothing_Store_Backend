import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SaleService } from './sales.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SalesController],
  providers: [SaleService],
  exports: [SaleService],
})
export class SalesModule {}
