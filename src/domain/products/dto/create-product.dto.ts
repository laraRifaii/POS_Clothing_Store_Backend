// dto/create-product.dto.ts
import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @Min(0)
  costPrice: number;  // Unit/wholesale price

  @IsNumber()
  @Min(0)
  salePrice: number;  // Retail/selling price

  @IsNumber()
  @Min(0)
  stock: number;
}