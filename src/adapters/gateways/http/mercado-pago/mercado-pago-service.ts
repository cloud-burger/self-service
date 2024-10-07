import { get, post } from '@cloud-burger/http-wrappers';
import { Payment } from '~/domain/payment/entities/payment';
import { PaymentService } from '~/domain/payment/services/payment';
import { CreatePaymentResponse } from './dtos/create-payment-response';
import { GetPaymentByIdResponse } from './dtos/get-payment-by-id-response';
import { MercadoPagoMapper } from './mappers/mercado-pago-mapper';

export class MercadoPagoService implements PaymentService {
  constructor(
    private mercadoPagoUrl: string,
    private mercadoPagoToken: string,
  ) {}

  async create(payment: Payment): Promise<Payment> {
    const request = MercadoPagoMapper.toHttp(payment);

    const { data } = await post<CreatePaymentResponse>({
      url: this.mercadoPagoUrl,
      data: request,
      headers: {
        Authorization: `Bearer ${this.mercadoPagoToken}`,
      },
    });

    payment.setEmv(data.qr_data);

    return payment;
  }

  async findByExternalId(id: string): Promise<Payment> {
    const { data } = await get<GetPaymentByIdResponse>({
      url: `${this.mercadoPagoUrl}/${id}`,
      headers: {
        Authorization: `Bearer ${this.mercadoPagoToken}`,
      },
    });

    return MercadoPagoMapper.toDomain(data);
  }
}
