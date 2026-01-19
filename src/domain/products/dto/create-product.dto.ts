import { IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;
  @IsString()
  sku: string;
  @IsString()
  category: string;
  @IsString()
  size: string;
  @IsString()
  color: string;

  @IsNumber()
  price: number;
  @IsNumber()
  stock: number;
}
