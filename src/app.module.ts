import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './domain/users/users.module';
import { AuthService } from './domain/auth/auth.service';
import { AuthController } from './domain/auth/auth.controller';
import { AuthModule } from './domain/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsService } from './domain/products/products.service';
import { ProductsController } from './domain/products/products.controller';
import { ProductsModule } from './domain/products/products.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProductsModule,
  ],
  controllers: [AppController, AuthController, ProductsController],
  providers: [AppService, AuthService, ProductsService],
})
export class AppModule {}
