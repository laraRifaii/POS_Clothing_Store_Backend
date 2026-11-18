import {
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
  IsInt,
  Min,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentType } from '../shared/paymentType.enum';


export class SaleItemDto {
  @IsInt()
  productId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number; // Optional: use current product price if not provided

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;
}

export class CreateSaleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items!: SaleItemDto[];

  @IsEnum(PaymentType)
  paymentType!: PaymentType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;
}

