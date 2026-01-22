import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthService } from './domain/auth/auth.service';
import { AuthController } from './domain/auth/auth.controller';
import { AuthModule } from './domain/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsService } from './domain/products/products.service';
import { ProductsController } from './domain/products/products.controller';
import { ProductsModule } from './domain/products/products.module';
import { SalesModule } from './domain/sales/sales.module';
import { RefundService } from './domain/refund/refund.service';
import { RefundController } from './domain/refund/refund.controller';
import { RefundModule } from './domain/refund/refund.module';
import { SettingsModule } from './domain/settings/settings.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    SalesModule,
    RefundModule,
    SettingsModule,
  ],
  controllers: [AppController, AuthController, ProductsController, RefundController],
  providers: [AppService, AuthService, ProductsService, RefundService],
})
export class AppModule {}
