import Joi from 'joi';

const productSchema = Joi.object({
  id: Joi.string(),
  quantity: Joi.number().min(1),
  notes: Joi.string()
});

export const orderSchema = Joi.object({
  products: Joi.array().min(1).items(productSchema).required().label('Products ids')
}).required();