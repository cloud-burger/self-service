export interface GetPaymentByIdResponse {
  id: number;
  external_reference: string;
  order_status: string;
  total_amount: number;
}
