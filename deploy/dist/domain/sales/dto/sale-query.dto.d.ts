import { PaymentType } from "../shared/paymentType.enum";
export declare class SaleQueryDto {
    startDate?: string;
    endDate?: string;
    paymentType?: PaymentType;
    userId?: number;
    page?: number;
    limit?: number;
}
