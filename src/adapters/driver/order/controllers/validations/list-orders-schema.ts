import Joi from 'joi';
import { OrderStatus } from '~/domain/order/entities/value-objects/enums/order-status';

export const listOrdersSchema = Joi.object({
  pageSize: Joi.number().required().min(1).label('Page size'),
  pageNumber: Joi.number().required().min(1).label('Page number'),
  status: Joi.string().valid(...Object.values(OrderStatus)),
}).required();
