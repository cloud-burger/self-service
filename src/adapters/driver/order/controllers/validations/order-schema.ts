import Joi from 'joi';

const productSchema = Joi.object({
  id: Joi.string().required().label('Product id'),
  quantity: Joi.number().min(1).required().label('Product quantity'),
  notes: Joi.string().label('Product notes'),
});

export const orderSchema = Joi.object({
  products: Joi.array()
    .min(1)
    .items(productSchema)
    .required()
    .label('Products'),
}).required();
