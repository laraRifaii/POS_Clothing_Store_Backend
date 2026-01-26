// dto/update-product.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  costPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  salePrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}