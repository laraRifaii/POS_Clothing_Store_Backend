import { IsEnum, IsNumber } from 'class-validator';

export class CreateSaleItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;
}

export class CreateSaleDto {

  @IsNumber({}, { each: true })  
  items: CreateSaleItemDto[];

  @IsEnum(['CASH', 'CARD', 'TRANSFER'])
  paymentType: 'CASH' | 'CARD' | 'TRANSFER';
}
