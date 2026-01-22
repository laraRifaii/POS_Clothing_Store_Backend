import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bcrypt from 'bcrypt';
import { AuthService } from './domain/auth/auth.service';
import { UserRole } from './domain/auth/enums/user-role.enum';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve uploaded files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true, // if you need cookies/auth headers
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // const userService = app.get(AuthService);

  // const existingAdmin = await userService.findByRole(UserRole.ADMIN);
  // if (existingAdmin.length > 0) {
  //   console.log('Admin already exists. Exiting...');
  //   process.exit(0);
  // }

  // const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);

  // await userService.signup({
  //   username: 'admin',
  //   // email: 'admin@example.com',
  //   password: hashedPassword,
  //   role: UserRole.ADMIN,
  // });

  // console.log('Admin user created successfully!');
  // process.exit(0);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
