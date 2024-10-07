import Joi from 'joi';

export const createPaymentSchema = Joi.object({
  orderId: Joi.string().uuid().required().label('Id do pedido'),
}).required();
