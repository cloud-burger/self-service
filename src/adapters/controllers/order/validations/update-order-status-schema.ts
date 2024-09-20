import Joi from 'joi';
import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      OrderStatus.RECEIVED,
      OrderStatus.PREPARING,
      OrderStatus.DONE,
      OrderStatus.FINISHED,
    )
    .required(),
  id: Joi.string().guid().required(),
}).required();
