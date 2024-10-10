export interface CreatePaymentRequest {
  title: string;
  description: string;
  external_reference: string;
  notification_url: string;
  total_amount: number;
  items: PaymentItem[];
}

interface PaymentItem {
  title: string;
  unit_price: number;
  quantity: number;
  unit_measure: string;
  total_amount: number;
}
