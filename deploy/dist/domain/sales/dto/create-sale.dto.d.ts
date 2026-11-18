import { PaymentType } from '../shared/paymentType.enum';
export declare class SaleItemDto {
    productId: number;
    quantity: number;
    price?: number;
    discount?: number;
}
export declare class CreateSaleDto {
    items: SaleItemDto[];
    paymentType: PaymentType;
    discount?: number;
}
