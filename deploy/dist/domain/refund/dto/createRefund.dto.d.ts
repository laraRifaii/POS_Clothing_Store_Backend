import { RefundType } from './shared/refundType.enum';
export declare class RefundItemDto {
    saleItemId: number;
    quantity: number;
    refundAmount: number;
}
export declare class CreateRefundDto {
    saleId: number;
    refundType: RefundType;
    reason: string;
    notes?: string;
    items: RefundItemDto[];
}
