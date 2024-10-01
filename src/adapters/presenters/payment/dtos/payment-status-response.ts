import { PaymentStatus } from "~/domain/payment/entities/value-objects/payment-status";

export interface PaymentStatusResponse {
  id: string;
  status: PaymentStatus;
}
