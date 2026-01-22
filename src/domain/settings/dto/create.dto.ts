import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStoreInfoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}
