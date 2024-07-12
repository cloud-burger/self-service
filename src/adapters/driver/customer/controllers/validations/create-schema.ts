import Joi from 'joi';
import { validateDocumentNumber } from '~/driver/validation-helpers/document-number';

export const createCustomerSchema = Joi.object({
  documentNumber: Joi.string()
    .required()
    .custom(validateDocumentNumber, 'custom validation')
    .label('Documento do cliente'),
  name: Joi.string().required().label('Nome do cliente'),
  email: Joi.string().label('Email do cliente'),
}).required();
