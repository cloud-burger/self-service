import Joi from 'joi';
import { validateDocumentNumber } from '~/driver/validation-helpers/document-number';

export const createCustomerSchema = Joi.object({
  documentNumber: Joi.string()
    .required()
    .custom(validateDocumentNumber)
    .label('Customer document number'),
  name: Joi.string().required().label('Customer name'),
  email: Joi.string().label('Customer email'),
}).required();
