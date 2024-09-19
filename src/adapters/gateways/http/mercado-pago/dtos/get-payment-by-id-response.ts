export interface GetPaymentByIdResponse {
  id: number;
  external_reference: string;
  status: string;
  total_amount: number;
}
