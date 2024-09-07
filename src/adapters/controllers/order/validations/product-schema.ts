import Joi from 'joi';
import { ProductCategory } from '~/domain/order/entities/value-objects/enums/product-category';

export const productSchema = Joi.object({
  name: Joi.string().required().label('Product name'),
  category: Joi.string()
    .required()
    .valid(...Object.values(ProductCategory))
    .label('Product category'),
  description: Joi.string().max(200).required().label('Product description'),
  amount: Joi.number().min(0).required().label('Product amount'),
  image: Joi.string().label('Product image'),
}).required();
